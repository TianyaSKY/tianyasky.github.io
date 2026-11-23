import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLandmarksFromParams,
  DEFAULT_CAMERA_INTRINSICS,
  DEFAULT_STRUCTURE_PARAMS,
  DEFAULT_VIRTUAL_CAMERA,
} from '../data/visionPositioningConfig.ts';
import {
  analyzeRayAnglePair,
  computeCameraBasis,
  generateTrajectoryPoints,
  projectLandmarkToImage,
  sampleSimulationTrajectory,
  threeToWorld,
  vecCross,
  vecDot,
  vecLength,
  worldToThree,
} from './visionMath.ts';

test('worldToThree and threeToWorld are exact rigid right-handed inverses', () => {
  const samples = [
    { x: 4.5, y: -3.0, z: 8.0 },
    { x: -12.4, y: 18.2, z: 0.5 },
    { x: 0, y: 0, z: 4.0 },
  ];

  for (const p of samples) {
    const t = worldToThree(p);
    const back = threeToWorld(t);
    assert.ok(Math.abs(back.x - p.x) < 1e-12);
    assert.ok(Math.abs(back.y - p.y) < 1e-12);
    assert.ok(Math.abs(back.z - p.z) < 1e-12);
    // Preserve vector magnitude
    assert.ok(Math.abs(vecLength(t) - vecLength(p)) < 1e-12);
  }

  // Right-handed orientation check: T(ex) x T(ey) == T(ez)
  const ex = worldToThree({ x: 1, y: 0, z: 0 });
  const ey = worldToThree({ x: 0, y: 1, z: 0 });
  const ez = worldToThree({ x: 0, y: 0, z: 1 });
  const cross = vecCross(ex, ey);
  assert.ok(Math.abs(vecDot(cross, ez) - 1) < 1e-12);
});

test('buildLandmarksFromParams encodes exact 8-point vertical pairing (z=4, z=8) without a 9th background landmark', () => {
  const landmarks = buildLandmarksFromParams(DEFAULT_STRUCTURE_PARAMS);
  assert.equal(landmarks.length, 8);

  const pairs: Array<[number, number]> = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
  ];

  for (const [lowerId, upperId] of pairs) {
    const lower = landmarks.find((l) => l.id === lowerId)!;
    const upper = landmarks.find((l) => l.id === upperId)!;
    assert.equal(lower.worldPos.z, 4.0);
    assert.equal(upper.worldPos.z, 8.0);
    assert.equal(lower.worldPos.x, upper.worldPos.x);
    assert.equal(lower.worldPos.y, upper.worldPos.y);
    assert.equal(lower.pairIndex, upper.pairIndex);
    assert.equal(lower.tier, 'lower');
    assert.equal(upper.tier, 'upper');
  }
});

test('Ray-Angle Invariance holds under arbitrary 3D camera rotations while camera center C is fixed', () => {
  const landmarks = buildLandmarksFromParams(DEFAULT_STRUCTURE_PARAMS);
  const p0 = landmarks[0];
  const p5 = landmarks[5];

  const baseBasis = computeCameraBasis(DEFAULT_VIRTUAL_CAMERA);
  const baseAnalysis = analyzeRayAnglePair(p0, p5, baseBasis, DEFAULT_CAMERA_INTRINSICS);

  assert.equal(baseAnalysis.bothInFront, true);
  assert.ok(baseAnalysis.worldAngleDeg > 5 && baseAnalysis.worldAngleDeg < 90);
  assert.ok(
    baseAnalysis.angleResidualDeg < 1e-6,
    `Expected near-zero residual, got ${baseAnalysis.angleResidualDeg}`,
  );

  // Rotate the camera by yaw, pitch, and roll without moving optical center C
  const rotatedCam = {
    ...DEFAULT_VIRTUAL_CAMERA,
    yawOffsetDeg: 14.5,
    pitchOffsetDeg: -6.2,
    rollDeg: 18.0,
  };
  const rotBasis = computeCameraBasis(rotatedCam);
  const rotAnalysis = analyzeRayAnglePair(p0, p5, rotBasis, DEFAULT_CAMERA_INTRINSICS);

  // Pixel coordinates MUST move when camera rotates
  const pixelShift = Math.hypot(
    rotAnalysis.projA.u - baseAnalysis.projA.u,
    rotAnalysis.projA.v - baseAnalysis.projA.v,
  );
  assert.ok(pixelShift > 50, `Expected significant pixel shift on rotation, got ${pixelShift}`);

  // Yet BOTH world angle and back-projected image ray angle MUST remain strictly invariant!
  assert.ok(Math.abs(rotAnalysis.worldAngleDeg - baseAnalysis.worldAngleDeg) < 1e-6);
  assert.ok(Math.abs(rotAnalysis.imageRayAngleDeg - baseAnalysis.imageRayAngleDeg) < 1e-6);
  assert.ok(rotAnalysis.angleResidualDeg < 1e-6);
});

test('Translating camera center C dynamically changes pairwise ray angle', () => {
  const landmarks = buildLandmarksFromParams(DEFAULT_STRUCTURE_PARAMS);
  const p0 = landmarks[0];
  const p2 = landmarks[2];

  const farBasis = computeCameraBasis({
    ...DEFAULT_VIRTUAL_CAMERA,
    position: { x: 0, y: -30, z: 5 },
  });
  const nearBasis = computeCameraBasis({
    ...DEFAULT_VIRTUAL_CAMERA,
    position: { x: 0, y: -10, z: 5 },
  });

  const farAngle = analyzeRayAnglePair(p0, p2, farBasis, DEFAULT_CAMERA_INTRINSICS).worldAngleDeg;
  const nearAngle = analyzeRayAnglePair(p0, p2, nearBasis, DEFAULT_CAMERA_INTRINSICS).worldAngleDeg;

  assert.ok(
    nearAngle > farAngle + 15,
    `Expected closer camera to subtend larger ray angle (${nearAngle} vs ${farAngle})`,
  );
});

test('projectLandmarkToImage accurately flags landmarks behind camera as not visible', () => {
  const landmarks = buildLandmarksFromParams(DEFAULT_STRUCTURE_PARAMS);
  const facingAwayBasis = computeCameraBasis({
    position: { x: 0, y: -20, z: 5 },
    lookAt: { x: 0, y: -40, z: 5 },
    yawOffsetDeg: 0,
    pitchOffsetDeg: 0,
    rollDeg: 0,
  });

  const proj = projectLandmarkToImage(landmarks[0], facingAwayBasis, DEFAULT_CAMERA_INTRINSICS);
  assert.equal(proj.inFront, false);
  assert.equal(proj.visibleInFrame, false);
});

test('sampleSimulationTrajectory produces continuous valid coastal camera poses', () => {
  const points = generateTrajectoryPoints(40);
  assert.equal(points.length, 41);
  for (let i = 0; i < points.length; i++) {
    assert.ok(points[i].z > 1.5, 'Camera stays above sea surface');
    assert.ok(points[i].y < -5, 'Camera observes from seaward approach');
    if (i > 0) {
      const step = Math.hypot(
        points[i].x - points[i - 1].x,
        points[i].y - points[i - 1].y,
        points[i].z - points[i - 1].z,
      );
      assert.ok(step < 3.5, `Trajectory step ${i} should be smooth, got ${step}`);
    }
  }
  const start = sampleSimulationTrajectory(0);
  const end = sampleSimulationTrajectory(1);
  assert.ok(start.position.x < 0 && end.position.x > 0);
});
