/**
 * Pure computer-vision and 3D projective geometry math module.
 * Zero DOM or Three.js dependencies so all calculations are unit-tested deterministically.
 *
 * Coordinate Systems:
 *   - World Frame (Engineering Z-up, right-handed): +X East, +Y North, +Z Up
 *   - Three.js Frame (Rendering Y-up, right-handed): +X Right, +Y Up, +Z Out-of-screen
 *
 * Rigid Orthogonal Mapping (det = +1, exact rotation by -90° around X):
 *   worldToThree(x, y, z) = (x, z, -y)
 *   threeToWorld(tx, ty, tz) = (tx, -tz, ty)
 */

import type {
  CameraIntrinsics,
  LandmarkSpec,
  Vec3,
  VirtualCameraState,
} from '../data/visionPositioningConfig';

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export function worldToThree(p: Vec3): Vec3 {
  return { x: p.x, y: p.z, z: -p.y };
}

export function threeToWorld(p: Vec3): Vec3 {
  return { x: p.x, y: -p.z, z: p.y };
}

export function vecSub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function vecAdd(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function vecScale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function vecDot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vecCross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function vecLength(v: Vec3): number {
  return Math.hypot(v.x, v.y, v.z);
}

export function vecNormalize(v: Vec3): Vec3 {
  const len = vecLength(v);
  if (len < 1e-12) {
    return { x: 0, y: 1, z: 0 };
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Rotates vector v around unit axis k by angleRad using Rodrigues' rotation formula.
 */
export function rotateAroundAxis(v: Vec3, axis: Vec3, angleRad: number): Vec3 {
  if (Math.abs(angleRad) < 1e-12) return { ...v };
  const k = vecNormalize(axis);
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);
  const kCrossV = vecCross(k, v);
  const kDotV = vecDot(k, v);
  return {
    x: v.x * cosA + kCrossV.x * sinA + k.x * kDotV * (1 - cosA),
    y: v.y * cosA + kCrossV.y * sinA + k.y * kDotV * (1 - cosA),
    z: v.z * cosA + kCrossV.z * sinA + k.z * kDotV * (1 - cosA),
  };
}

/**
 * Right-handed pinhole camera basis expressed in World Z-up coordinates:
 *   - forward (+Zc): camera optical axis pointing into the scene
 *   - right   (+Xc): image u-axis pointing right
 *   - down    (+Yc): image v-axis pointing downward (standard CV convention)
 *   - up      (-Yc): camera vertical up vector
 * Note: right × down = forward (right-handed CV frame: X right, Y down, Z forward).
 */
export interface CameraBasis {
  position: Vec3;
  forward: Vec3;
  right: Vec3;
  down: Vec3;
  up: Vec3;
  yawDeg: number; // azimuth in XY plane (0° = +Y North, +90° = +X East)
  pitchDeg: number; // elevation angle (+ upward, - downward)
}

export function computeCameraBasis(cam: VirtualCameraState): CameraBasis {
  const rawForward = vecSub(cam.lookAt, cam.position);
  let forward = vecNormalize(
    vecLength(rawForward) > 1e-6 ? rawForward : { x: 0, y: 1, z: 0 },
  );

  // World Z-up reference
  const worldUp: Vec3 = { x: 0, y: 0, z: 1 };
  let right = vecCross(forward, worldUp);
  if (vecLength(right) < 1e-6) {
    right = { x: 1, y: 0, z: 0 };
  } else {
    right = vecNormalize(right);
  }
  let up = vecNormalize(vecCross(right, forward));

  // Apply extra yaw around world Z axis (for interactive rotation-invariance tests)
  if (Math.abs(cam.yawOffsetDeg) > 1e-6) {
    const yawRad = cam.yawOffsetDeg * DEG_TO_RAD;
    forward = vecNormalize(rotateAroundAxis(forward, worldUp, yawRad));
    right = vecNormalize(rotateAroundAxis(right, worldUp, yawRad));
    up = vecNormalize(vecCross(right, forward));
  }

  // Apply extra pitch around camera right axis
  if (Math.abs(cam.pitchOffsetDeg) > 1e-6) {
    const pitchRad = cam.pitchOffsetDeg * DEG_TO_RAD;
    forward = vecNormalize(rotateAroundAxis(forward, right, pitchRad));
    up = vecNormalize(vecCross(right, forward));
  }

  // Apply roll around optical axis (forward)
  if (Math.abs(cam.rollDeg) > 1e-6) {
    const rollRad = cam.rollDeg * DEG_TO_RAD;
    right = vecNormalize(rotateAroundAxis(right, forward, rollRad));
    up = vecNormalize(vecCross(right, forward));
  }

  const down = vecScale(up, -1);

  const yawDeg = Math.atan2(forward.x, forward.y) * RAD_TO_DEG;
  const pitchDeg = Math.asin(clamp(forward.z, -1, 1)) * RAD_TO_DEG;

  return {
    position: { ...cam.position },
    forward,
    right,
    down,
    up,
    yawDeg,
    pitchDeg,
  };
}

export interface LandmarkProjection {
  landmarkId: number;
  cameraCoords: Vec3; // (Xc, Yc, Zc) in CV camera frame
  u: number; // pixel x
  v: number; // pixel y
  depth: number; // Zc along optical axis
  distance: number; // Euclidean ||P - C||
  inFront: boolean;
  visibleInFrame: boolean;
  worldSightlineUnit: Vec3; // v_i = normalize(P_i - C) in world frame
  backProjectedRayCam: Vec3; // d_i = normalize(K^-1 [u, v, 1]^T) in camera frame
  backProjectedRayWorld: Vec3; // R_wc * d_i in world frame
}

export function projectLandmarkToImage(
  landmark: LandmarkSpec,
  basis: CameraBasis,
  intrinsics: CameraIntrinsics,
): LandmarkProjection {
  const diff = vecSub(landmark.worldPos, basis.position);
  const distance = vecLength(diff);
  const worldSightlineUnit = vecNormalize(diff);

  // Transform world delta into CV camera frame (Xc right, Yc down, Zc forward)
  const xc = vecDot(diff, basis.right);
  const yc = vecDot(diff, basis.down);
  const zc = vecDot(diff, basis.forward);

  const inFront = zc > 0.15;
  const safeZ = Math.abs(zc) > 1e-6 ? zc : 1e-6;
  const u = intrinsics.fx * (xc / safeZ) + intrinsics.cx;
  const v = intrinsics.fy * (yc / safeZ) + intrinsics.cy;

  const visibleInFrame =
    inFront && u >= 0 && u <= intrinsics.width && v >= 0 && v <= intrinsics.height;

  // Back-project 2D pixel (u, v) via K^-1 to unit ray in camera coordinates
  const rayCamRaw: Vec3 = {
    x: (u - intrinsics.cx) / intrinsics.fx,
    y: (v - intrinsics.cy) / intrinsics.fy,
    z: 1.0,
  };
  const backProjectedRayCam = vecNormalize(rayCamRaw);

  // Rotate back-projected camera ray into world frame: d_w = x*right + y*down + z*forward
  const backProjectedRayWorld = vecNormalize({
    x:
      backProjectedRayCam.x * basis.right.x +
      backProjectedRayCam.y * basis.down.x +
      backProjectedRayCam.z * basis.forward.x,
    y:
      backProjectedRayCam.x * basis.right.y +
      backProjectedRayCam.y * basis.down.y +
      backProjectedRayCam.z * basis.forward.y,
    z:
      backProjectedRayCam.x * basis.right.z +
      backProjectedRayCam.y * basis.down.z +
      backProjectedRayCam.z * basis.forward.z,
  });

  return {
    landmarkId: landmark.id,
    cameraCoords: { x: xc, y: yc, z: zc },
    u,
    v,
    depth: zc,
    distance,
    inFront,
    visibleInFrame,
    worldSightlineUnit,
    backProjectedRayCam,
    backProjectedRayWorld,
  };
}

export function computeRayAngleDeg(unitA: Vec3, unitB: Vec3): number {
  const d = clamp(vecDot(vecNormalize(unitA), vecNormalize(unitB)), -1, 1);
  return Math.acos(d) * RAD_TO_DEG;
}

export interface RayAnglePairAnalysis {
  idA: number;
  idB: number;
  worldAngleDeg: number; // arccos(v_A · v_B) from C and 3D landmarks
  imageRayAngleDeg: number; // arccos(d_A · d_B) from 2D pixel back-projection & K
  angleResidualDeg: number; // |worldAngleDeg - imageRayAngleDeg| (0° under exact projection)
  cosWorldAngle: number;
  cosImageAngle: number;
  distanceA: number;
  distanceB: number;
  chordDistanceAB: number;
  bothInFront: boolean;
  bothVisibleInFrame: boolean;
  projA: LandmarkProjection;
  projB: LandmarkProjection;
}

export function analyzeRayAnglePair(
  landmarkA: LandmarkSpec,
  landmarkB: LandmarkSpec,
  basis: CameraBasis,
  intrinsics: CameraIntrinsics,
): RayAnglePairAnalysis {
  const projA = projectLandmarkToImage(landmarkA, basis, intrinsics);
  const projB = projectLandmarkToImage(landmarkB, basis, intrinsics);

  const cosWorldAngle = clamp(
    vecDot(projA.worldSightlineUnit, projB.worldSightlineUnit),
    -1,
    1,
  );
  const worldAngleDeg = Math.acos(cosWorldAngle) * RAD_TO_DEG;

  const cosImageAngle = clamp(
    vecDot(projA.backProjectedRayCam, projB.backProjectedRayCam),
    -1,
    1,
  );
  const imageRayAngleDeg = Math.acos(cosImageAngle) * RAD_TO_DEG;

  const bothInFront = projA.inFront && projB.inFront;
  const angleResidualDeg = bothInFront
    ? Math.abs(worldAngleDeg - imageRayAngleDeg)
    : Math.abs(worldAngleDeg - imageRayAngleDeg);

  const chordDistanceAB = vecLength(vecSub(landmarkA.worldPos, landmarkB.worldPos));

  return {
    idA: landmarkA.id,
    idB: landmarkB.id,
    worldAngleDeg,
    imageRayAngleDeg,
    angleResidualDeg,
    cosWorldAngle,
    cosImageAngle,
    distanceA: projA.distance,
    distanceB: projB.distance,
    chordDistanceAB,
    bothInFront,
    bothVisibleInFrame: projA.visibleInFrame && projB.visibleInFrame,
    projA,
    projB,
  };
}

/**
 * Deterministic nearshore vessel / patrol camera trajectory (Simulation Demo).
 * Parameter t in [0, 1] sweeps a smooth coastal observation arc in front of the structure
 * with realistic gentle vessel heave and heading adjustments.
 */
export function sampleSimulationTrajectory(t: number): VirtualCameraState {
  const u = clamp(t, 0, 1);
  // Azimuth sweep from -52 deg to +52 deg facing the offshore structure
  const theta = (-52 + u * 104) * DEG_TO_RAD;
  const radius = 21.5 + 3.2 * Math.sin(u * Math.PI * 2);
  const x = radius * Math.sin(theta);
  const y = -radius * Math.cos(theta);
  // Gentle marine elevation change (vessel deck height + subtle swell heave)
  const z = 3.2 + 1.4 * Math.sin(u * Math.PI) + 0.28 * Math.sin(u * Math.PI * 6);

  return {
    position: {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
      z: Number(z.toFixed(3)),
    },
    lookAt: {
      x: Number((0.4 * Math.sin(u * Math.PI * 2)).toFixed(3)),
      y: 0,
      z: 5.8,
    },
    yawOffsetDeg: 0,
    pitchOffsetDeg: 0,
    rollDeg: Number((1.6 * Math.sin(u * Math.PI * 4)).toFixed(2)),
  };
}

/**
 * Generates an ordered array of world-space points along the simulation trajectory
 * for rendering the 3D path curve.
 */
export function generateTrajectoryPoints(steps = 72): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    pts.push(sampleSimulationTrajectory(i / steps).position);
  }
  return pts;
}
