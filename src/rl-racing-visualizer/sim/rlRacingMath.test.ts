import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONFIG,
  RAY_ANGLES_DEG,
  SCENARIO_PRESETS,
  buildObstaclesOnTrack,
  castLidarRays,
  computeObservationSnapshot,
  generateCircuitTrack,
  intersectRayAABB2D,
} from './rlRacingMath.ts';

test('generateCircuitTrack builds closed smooth spline with unit tangents and normals', () => {
  const track = generateCircuitTrack(12);
  assert.equal(track.length, 20 * 12);
  for (const s of track) {
    const tLen = Math.hypot(s.tx, s.tz);
    const nLen = Math.hypot(s.nx, s.nz);
    assert.ok(Math.abs(tLen - 1) < 1e-6, `tangent length ${tLen}`);
    assert.ok(Math.abs(nLen - 1) < 1e-6, `normal length ${nLen}`);
    assert.ok(Math.abs(s.tx * s.nx + s.tz * s.nz) < 1e-6, 'tangent and normal must be orthogonal');
  }
});

test('intersectRayAABB2D computes exact distance to obstacle face', () => {
  const box = { id: 'o1', label: 'A', x: 0, z: 20, halfWidth: 2, halfDepth: 2, height: 2 };
  // Straight along +Z should hit z = 18 at t = 18
  const hitT = intersectRayAABB2D(0, 0, 0, 1, box, 80);
  assert.ok(hitT !== null);
  assert.ok(Math.abs(hitT - 18) < 1e-6);

  // Opposite direction should miss
  const missT = intersectRayAABB2D(0, 0, 0, -1, box, 80);
  assert.equal(missT, null);
});

test('castLidarRays produces 9 readings matching exact RacingCar fan angles', () => {
  const obs = [
    { id: 'front', label: 'Front', x: 0, z: 16, halfWidth: 2, halfDepth: 2, height: 2 },
  ];
  const rays = castLidarRays(0, 0, 0, obs);
  assert.equal(rays.length, 9);
  assert.deepEqual(
    rays.map((r) => r.angleDeg),
    [...RAY_ANGLES_DEG],
  );
  // Center ray (index 4, angle 0°) hits front face at z = 14 -> normalized = 14 / 80
  assert.equal(rays[4].hit, true);
  assert.ok(Math.abs(rays[4].distance - 14) < 1e-6);
  assert.ok(Math.abs(rays[4].normalized - 14 / 80) < 1e-6);
  // Side rays (-90° and +90°) miss -> normalized = 1.0
  assert.equal(rays[0].hit, false);
  assert.equal(rays[0].normalized, 1.0);
  assert.equal(rays[8].hit, false);
  assert.equal(rays[8].normalized, 1.0);
});

test('computeObservationSnapshot returns exact 16-D normalized vector and rewards', () => {
  const track = generateCircuitTrack(16);
  const preset = SCENARIO_PRESETS[0];
  const obstacles = buildObstaclesOnTrack(track, preset.pose.trackSampleIndex, preset.obstacles);
  const snap = computeObservationSnapshot(track, preset.pose, obstacles);

  assert.equal(snap.vector.length, 16);
  assert.equal(snap.dimensions.length, 16);
  // Verify normalization identities
  assert.ok(Math.abs(snap.vector[0] - snap.carX / CONFIG.WORLD_NORM_SCALE) < 1e-6);
  assert.ok(Math.abs(snap.vector[1] - snap.carZ / CONFIG.WORLD_NORM_SCALE) < 1e-6);
  assert.ok(Math.abs(snap.vector[3] - snap.speed / CONFIG.CAR_BASE_SPEED) < 1e-6);
  assert.ok(Math.abs(snap.vector[4] - snap.trackDist / (CONFIG.ROAD_WIDTH * 2)) < 1e-6);
  // Default hero scenario should have at least 1 ray hitting an obstacle and no car collision
  assert.equal(snap.reward.isCollision, false);
  assert.equal(snap.reward.isOutOfBounds, false);
  assert.ok(snap.rays.some((r) => r.hit), 'Hero scenario must have at least one LiDAR obstacle hit');
});

test('out-of-bounds penalty triggers strictly above ROAD_WIDTH + OFF_ROAD_TOLERANCE', () => {
  const track = generateCircuitTrack(16);
  const snapSafe = computeObservationSnapshot(
    track,
    { trackSampleIndex: 0, lateralOffset: 11.0, relativeYawDeg: 0, speed: 0.6, actionId: 1 },
    [],
  );
  assert.equal(snapSafe.reward.isOutOfBounds, false);

  const snapOut = computeObservationSnapshot(
    track,
    { trackSampleIndex: 0, lateralOffset: 13.5, relativeYawDeg: 0, speed: 0.6, actionId: 1 },
    [],
  );
  assert.equal(snapOut.reward.isOutOfBounds, true);
  assert.equal(snapOut.reward.total, CONFIG.REWARD_OUT_OF_BOUNDS_PENALTY);
});
