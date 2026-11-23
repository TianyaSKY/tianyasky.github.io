/**
 * Pure simulation & mathematical definitions matching TianyaSKY/RacingCar
 * (https://tianyasky.github.io/projects/rl-racing)
 *
 * Kept strictly free of Three.js / DOM dependencies for deterministic unit testing.
 */

export const CONFIG = {
  CAR_BASE_SPEED: 0.8,
  TURN_SPEED: 2.5,
  ACCELERATION: 0.02,
  FRICTION: 0.96,
  ROAD_WIDTH: 10.0,
  OFF_ROAD_TOLERANCE: 2.0,
  MAX_RAY_DISTANCE: 80.0,
  WORLD_NORM_SCALE: 400.0,
  TRACK_POINTS: 20,
  TRACK_RADIUS: 150,
  TRACK_VARIANCE: 40,
  REWARD_STEP_PENALTY: -1.0,
  REWARD_COLLISION_PENALTY: -100.0,
  REWARD_OUT_OF_BOUNDS_PENALTY: -100.0,
  REWARD_SPEED_REWARD: 2.5,
  REWARD_TRACK_CENTER_REWARD: 0.25,
} as const;

/** Exact 9-ray sparse symmetric forward fan LiDAR angles (degrees) from racing_env.py */
export const RAY_ANGLES_DEG = [-90, -30, -15, -5, 0, 5, 15, 30, 90] as const;

export interface DiscreteActionDef {
  id: number;
  label: string;
  throttle: -1 | 0 | 1;
  steer: -1 | 0 | 1; // -1 = left, 1 = right
}

export const DISCRETE_ACTIONS: readonly DiscreteActionDef[] = [
  { id: 0, label: 'Coast', throttle: 0, steer: 0 },
  { id: 1, label: 'Accelerate', throttle: 1, steer: 0 },
  { id: 2, label: 'Brake', throttle: -1, steer: 0 },
  { id: 3, label: 'Steer left', throttle: 0, steer: -1 },
  { id: 4, label: 'Steer right', throttle: 0, steer: 1 },
  { id: 5, label: 'Accel + left', throttle: 1, steer: -1 },
  { id: 6, label: 'Accel + right', throttle: 1, steer: 1 },
] as const;

export interface Vec2 {
  x: number;
  z: number;
}

export interface TrackSample {
  x: number;
  z: number;
  tx: number; // unit tangent x
  tz: number; // unit tangent z
  nx: number; // unit right normal x
  nz: number; // unit right normal z
  s: number;  // cumulative arc length
}

export interface ObstacleBox {
  id: string;
  label: string;
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
  height: number;
}

export interface RaycastReading {
  index: number;      // 0..8
  obsIndex: number;   // 7..15
  angleDeg: number;   // -90..90
  worldAngleRad: number;
  dirX: number;
  dirZ: number;
  distance: number;   // meters in [0, 80]
  normalized: number; // distance / 80
  hit: boolean;
  hitObstacleId: string | null;
  endX: number;
  endZ: number;
}

export interface ObservationDimension {
  index: number;
  group: 'position' | 'heading' | 'speed' | 'centerline' | 'lidar';
  key: string;
  formula: string;
  rawDisplay: string;
  normalized: number;
}

export interface RewardBreakdown {
  stepPenalty: number;
  speedReward: number;
  centerlineReward: number;
  collisionPenalty: number;
  outOfBoundsPenalty: number;
  total: number;
  isCollision: boolean;
  isOutOfBounds: boolean;
}

export interface VehiclePoseParams {
  trackSampleIndex: number; // index along spline
  lateralOffset: number;    // meters from centerline (+ right, - left)
  relativeYawDeg: number;   // degrees relative to track tangent
  speed: number;            // 0..0.8 (CAR_BASE_SPEED)
  actionId: number;         // 0..6
}

export interface ScenarioPreset {
  id: string;
  name: string;
  pose: VehiclePoseParams;
  obstacles: Array<{
    id: string;
    label: string;
    sampleOffset: number; // steps ahead along spline
    lateralOffset: number;
    halfWidth: number;
    halfDepth: number;
    height: number;
  }>;
}

export interface ObservationSnapshot {
  carX: number;
  carZ: number;
  carAngleDeg: number; // world yaw in degrees where 0 = +Z, +90 = +X
  speed: number;
  action: DiscreteActionDef;
  closestPoint: Vec2;
  closestTangent: Vec2;
  trackDist: number;
  signedLateralOffset: number;
  dxToCenter: number;
  dzToCenter: number;
  rays: RaycastReading[];
  vector: number[]; // exact length 16
  dimensions: ObservationDimension[];
  reward: RewardBreakdown;
}

export const SCENARIO_PRESETS: readonly ScenarioPreset[] = [
  {
    id: 'corner-avoidance',
    name: 'Corner avoidance',
    pose: {
      trackSampleIndex: 14,
      lateralOffset: 2.6,
      relativeYawDeg: -10,
      speed: 0.68,
      actionId: 5, // Accel + Left
    },
    obstacles: [
      {
        id: 'obs-1',
        label: 'Obstacle A',
        sampleOffset: 5,
        lateralOffset: 1.4,
        halfWidth: 1.9,
        halfDepth: 1.9,
        height: 2.4,
      },
      {
        id: 'obs-2',
        label: 'Obstacle B',
        sampleOffset: 9,
        lateralOffset: -4.2,
        halfWidth: 2.0,
        halfDepth: 2.0,
        height: 2.6,
      },
      {
        id: 'obs-3',
        label: 'Obstacle C',
        sampleOffset: 14,
        lateralOffset: 3.4,
        halfWidth: 1.75,
        halfDepth: 1.75,
        height: 2.2,
      },
    ],
  },
  {
    id: 'high-speed-center',
    name: 'Fast straight',
    pose: {
      trackSampleIndex: 0,
      lateralOffset: 0.4,
      relativeYawDeg: 0,
      speed: 0.8,
      actionId: 1, // Accelerate
    },
    obstacles: [
      {
        id: 'obs-1',
        label: 'Obstacle A',
        sampleOffset: 12,
        lateralOffset: 0.2,
        halfWidth: 1.9,
        halfDepth: 1.9,
        height: 2.5,
      },
      {
        id: 'obs-2',
        label: 'Obstacle B',
        sampleOffset: 8,
        lateralOffset: 4.8,
        halfWidth: 1.7,
        halfDepth: 1.7,
        height: 2.2,
      },
      {
        id: 'obs-3',
        label: 'Obstacle C',
        sampleOffset: 22,
        lateralOffset: -3.4,
        halfWidth: 1.9,
        halfDepth: 1.9,
        height: 2.4,
      },
    ],
  },
  {
    id: 'edge-recovery',
    name: 'Edge recovery',
    pose: {
      trackSampleIndex: 16,
      lateralOffset: 8.6,
      relativeYawDeg: -22,
      speed: 0.52,
      actionId: 3, // Steer Left
    },
    obstacles: [
      {
        id: 'obs-1',
        label: 'Obstacle A',
        sampleOffset: 8,
        lateralOffset: 2.8,
        halfWidth: 1.9,
        halfDepth: 1.9,
        height: 2.4,
      },
      {
        id: 'obs-2',
        label: 'Obstacle B',
        sampleOffset: 15,
        lateralOffset: -2.2,
        halfWidth: 1.85,
        halfDepth: 1.85,
        height: 2.4,
      },
      {
        id: 'obs-3',
        label: 'Obstacle C',
        sampleOffset: 3,
        lateralOffset: -2.6,
        halfWidth: 1.6,
        halfDepth: 1.6,
        height: 2.1,
      },
    ],
  },
] as const;

/**
 * Generates a closed Catmull-Rom circuit spline resembling RacingCar's procedural track
 * (20 polar control points, smooth sweeping curves and straightaways).
 */
export function generateCircuitTrack(segmentsPerSpan = 16): TrackSample[] {
  // Deterministic sculpted control points (radius ~135..175m) matching TRACK_RADIUS=150, VARIANCE=40
  const radii = [
    152, 168, 174, 155, 130, 122, 138, 165, 178, 160,
    142, 126, 134, 158, 175, 168, 146, 128, 136, 148,
  ];
  const n = radii.length;
  const ctrl: Vec2[] = radii.map((r, i) => {
    const theta = (i / n) * Math.PI * 2;
    return {
      x: Math.cos(theta) * r,
      z: Math.sin(theta) * r,
    };
  });

  const rawPoints: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = ctrl[(i - 1 + n) % n];
    const p1 = ctrl[i];
    const p2 = ctrl[(i + 1) % n];
    const p3 = ctrl[(i + 2) % n];

    for (let j = 0; j < segmentsPerSpan; j++) {
      const t = j / segmentsPerSpan;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const z =
        0.5 *
        (2 * p1.z +
          (-p0.z + p2.z) * t +
          (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
          (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);
      rawPoints.push({ x, z });
    }
  }

  const samples: TrackSample[] = [];
  let cumulativeS = 0;
  const total = rawPoints.length;

  for (let i = 0; i < total; i++) {
    const prev = rawPoints[(i - 1 + total) % total];
    const curr = rawPoints[i];
    const next = rawPoints[(i + 1) % total];

    if (i > 0) {
      cumulativeS += Math.hypot(curr.x - prev.x, curr.z - prev.z);
    }

    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    const tx = dx / len;
    const tz = dz / len;
    // Right-hand normal on XZ plane (when facing (tx, tz), right is (-tz, tx))
    const nx = -tz;
    const nz = tx;

    samples.push({ x: curr.x, z: curr.z, tx, tz, nx, nz, s: cumulativeS });
  }

  return samples;
}

export function buildObstaclesOnTrack(
  track: TrackSample[],
  baseIndex: number,
  defs: ScenarioPreset['obstacles'],
): ObstacleBox[] {
  const n = track.length;
  return defs.map((d) => {
    const idx = ((baseIndex + d.sampleOffset) % n + n) % n;
    const s = track[idx];
    return {
      id: d.id,
      label: d.label,
      x: s.x + s.nx * d.lateralOffset,
      z: s.z + s.nz * d.lateralOffset,
      halfWidth: d.halfWidth,
      halfDepth: d.halfDepth,
      height: d.height,
    };
  });
}

export function getCarWorldPose(
  track: TrackSample[],
  pose: VehiclePoseParams,
): { x: number; z: number; angleDeg: number } {
  const n = track.length;
  const idx = ((pose.trackSampleIndex % n) + n) % n;
  const s = track[idx];
  const x = s.x + s.nx * pose.lateralOffset;
  const z = s.z + s.nz * pose.lateralOffset;
  // In RacingCar, ray_dx = sin(rad), ray_dz = cos(rad) => angle = atan2(dx, dz)
  const tangentAngleDeg = (Math.atan2(s.tx, s.tz) * 180) / Math.PI;
  const angleDeg = ((tangentAngleDeg + pose.relativeYawDeg) % 360 + 360) % 360;
  return { x, z, angleDeg };
}

/**
 * Finds the exact closest point on the track centerline (interpolating along segments for precision).
 */
export function findClosestTrackPoint(
  track: TrackSample[],
  x: number,
  z: number,
): { point: Vec2; tangent: Vec2; normal: Vec2; distance: number; signedLateral: number } {
  let minDistSq = Infinity;
  let bestPoint: Vec2 = { x: track[0].x, z: track[0].z };
  let bestTangent: Vec2 = { x: track[0].tx, z: track[0].tz };
  let bestNormal: Vec2 = { x: track[0].nx, z: track[0].nz };

  const n = track.length;
  for (let i = 0; i < n; i++) {
    const a = track[i];
    const b = track[(i + 1) % n];
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const abLenSq = abx * abx + abz * abz || 1e-8;
    const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.z) * abz) / abLenSq));
    const px = a.x + abx * t;
    const pz = a.z + abz * t;
    const dSq = (x - px) * (x - px) + (z - pz) * (z - pz);
    if (dSq < minDistSq) {
      minDistSq = dSq;
      bestPoint = { x: px, z: pz };
      const segLen = Math.sqrt(abLenSq);
      const tx = abx / segLen;
      const tz = abz / segLen;
      bestTangent = { x: tx, z: tz };
      bestNormal = { x: -tz, z: tx };
    }
  }

  const distance = Math.sqrt(minDistSq);
  const signedLateral = (x - bestPoint.x) * bestNormal.x + (z - bestPoint.z) * bestNormal.z;

  return {
    point: bestPoint,
    tangent: bestTangent,
    normal: bestNormal,
    distance,
    signedLateral,
  };
}

/**
 * Exact slab ray-AABB intersection in XZ plane.
 * Returns hit distance t in [0, maxDistance] or null if no hit.
 */
export function intersectRayAABB2D(
  originX: number,
  originZ: number,
  dirX: number,
  dirZ: number,
  box: ObstacleBox,
  maxDistance: number,
): number | null {
  const minX = box.x - box.halfWidth;
  const maxX = box.x + box.halfWidth;
  const minZ = box.z - box.halfDepth;
  const maxZ = box.z + box.halfDepth;

  let tMin = 0;
  let tMax = maxDistance;

  if (Math.abs(dirX) < 1e-8) {
    if (originX < minX || originX > maxX) return null;
  } else {
    const invD = 1 / dirX;
    let t1 = (minX - originX) * invD;
    let t2 = (maxX - originX) * invD;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  }

  if (Math.abs(dirZ) < 1e-8) {
    if (originZ < minZ || originZ > maxZ) return null;
  } else {
    const invD = 1 / dirZ;
    let t1 = (minZ - originZ) * invD;
    let t2 = (maxZ - originZ) * invD;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  }

  if (tMin < 0 || tMin > maxDistance) return null;
  return tMin;
}

/**
 * Casts all 9 symmetric fan rays from the car center, matching racing_env.py `_raycast_obstacles`.
 */
export function castLidarRays(
  carX: number,
  carZ: number,
  carAngleDeg: number,
  obstacles: ObstacleBox[],
  maxDistance: number = CONFIG.MAX_RAY_DISTANCE,
): RaycastReading[] {
  const baseRad = (carAngleDeg * Math.PI) / 180;

  return RAY_ANGLES_DEG.map((angleDeg, index) => {
    const worldAngleRad = baseRad + (angleDeg * Math.PI) / 180;
    const dirX = Math.sin(worldAngleRad);
    const dirZ = Math.cos(worldAngleRad);

    let minDist = maxDistance;
    let hit = false;
    let hitObstacleId: string | null = null;

    for (const obs of obstacles) {
      const t = intersectRayAABB2D(carX, carZ, dirX, dirZ, obs, minDist);
      if (t !== null && t < minDist) {
        minDist = t;
        hit = true;
        hitObstacleId = obs.id;
      }
    }

    const clamped = Math.max(0, Math.min(maxDistance, minDist));
    return {
      index,
      obsIndex: 7 + index,
      angleDeg,
      worldAngleRad,
      dirX,
      dirZ,
      distance: clamped,
      normalized: clamped / maxDistance,
      hit,
      hitObstacleId,
      endX: carX + dirX * clamped,
      endZ: carZ + dirZ * clamped,
    };
  });
}

export function checkCarObstacleCollision(
  carX: number,
  carZ: number,
  obstacles: ObstacleBox[],
  carHalfExtent = 1.35,
): boolean {
  const cMinX = carX - carHalfExtent;
  const cMaxX = carX + carHalfExtent;
  const cMinZ = carZ - carHalfExtent;
  const cMaxZ = carZ + carHalfExtent;

  for (const obs of obstacles) {
    const oMinX = obs.x - obs.halfWidth;
    const oMaxX = obs.x + obs.halfWidth;
    const oMinZ = obs.z - obs.halfDepth;
    const oMaxZ = obs.z + obs.halfDepth;
    if (cMinX < oMaxX && cMaxX > oMinX && cMinZ < oMaxZ && cMaxZ > oMinZ) {
      return true;
    }
  }
  return false;
}

/**
 * Computes the complete 16-D Box(16,) observation vector and reward terms exactly per RacingEnv.
 */
export function computeObservationSnapshot(
  track: TrackSample[],
  pose: VehiclePoseParams,
  obstacles: ObstacleBox[],
): ObservationSnapshot {
  const { x: carX, z: carZ, angleDeg: carAngleDeg } = getCarWorldPose(track, pose);
  const speed = Math.max(0, Math.min(CONFIG.CAR_BASE_SPEED, pose.speed));
  const action =
    DISCRETE_ACTIONS.find((a) => a.id === pose.actionId) ?? DISCRETE_ACTIONS[0];

  const closest = findClosestTrackPoint(track, carX, carZ);
  const dxToCenter = closest.point.x - carX;
  const dzToCenter = closest.point.z - carZ;
  const trackDist = closest.distance;

  const normX = carX / CONFIG.WORLD_NORM_SCALE;
  const normZ = carZ / CONFIG.WORLD_NORM_SCALE;
  const wrappedAngle = ((carAngleDeg % 360) + 360) % 360;
  const normAngle = wrappedAngle / 180.0 - 1.0;
  const normSpeed = speed / CONFIG.CAR_BASE_SPEED;
  const normTrackDist = trackDist / (CONFIG.ROAD_WIDTH * 2);
  const normTrackDirX = trackDist > 1e-6 ? dxToCenter / (CONFIG.ROAD_WIDTH * 2) : 0;
  const normTrackDirZ = trackDist > 1e-6 ? dzToCenter / (CONFIG.ROAD_WIDTH * 2) : 0;

  const rays = castLidarRays(carX, carZ, carAngleDeg, obstacles);

  const vector: number[] = [
    normX,
    normZ,
    normAngle,
    normSpeed,
    normTrackDist,
    normTrackDirX,
    normTrackDirZ,
    ...rays.map((r) => r.normalized),
  ];

  const dimensions: ObservationDimension[] = [
    {
      index: 0,
      group: 'position',
      key: 'x',
      formula: 'x / 400',
      rawDisplay: `${carX.toFixed(1)} m`,
      normalized: normX,
    },
    {
      index: 1,
      group: 'position',
      key: 'z',
      formula: 'z / 400',
      rawDisplay: `${carZ.toFixed(1)} m`,
      normalized: normZ,
    },
    {
      index: 2,
      group: 'heading',
      key: 'angle',
      formula: '(θ%360)/180 - 1',
      rawDisplay: `${wrappedAngle.toFixed(1)}°`,
      normalized: normAngle,
    },
    {
      index: 3,
      group: 'speed',
      key: 'speed',
      formula: 'v / 0.8',
      rawDisplay: `${speed.toFixed(2)} u/f`,
      normalized: normSpeed,
    },
    {
      index: 4,
      group: 'centerline',
      key: 'track_dist',
      formula: 'd / (2·W)',
      rawDisplay: `${trackDist.toFixed(2)} m`,
      normalized: normTrackDist,
    },
    {
      index: 5,
      group: 'centerline',
      key: 'track_dir_x',
      formula: 'dx / 20',
      rawDisplay: `${dxToCenter.toFixed(2)} m`,
      normalized: normTrackDirX,
    },
    {
      index: 6,
      group: 'centerline',
      key: 'track_dir_z',
      formula: 'dz / 20',
      rawDisplay: `${dzToCenter.toFixed(2)} m`,
      normalized: normTrackDirZ,
    },
    ...rays.map((ray) => ({
      index: ray.obsIndex,
      group: 'lidar' as const,
      key: `ray_${ray.index}`,
      formula: 'd / 80',
      rawDisplay: ray.hit ? `${ray.distance.toFixed(1)} m` : '80.0 m',
      normalized: ray.normalized,
    })),
  ];

  // Reward calculation matching racing_env.py step()
  const isCollision = checkCarObstacleCollision(carX, carZ, obstacles);
  const isOutOfBounds = trackDist > CONFIG.ROAD_WIDTH + CONFIG.OFF_ROAD_TOLERANCE;
  const stepPenalty = CONFIG.REWARD_STEP_PENALTY;
  const collisionPenalty = isCollision ? CONFIG.REWARD_COLLISION_PENALTY : 0;
  const outOfBoundsPenalty = !isCollision && isOutOfBounds ? CONFIG.REWARD_OUT_OF_BOUNDS_PENALTY : 0;
  const speedReward = !isCollision && !isOutOfBounds ? speed * CONFIG.REWARD_SPEED_REWARD : 0;
  const centerlineReward =
    !isCollision && !isOutOfBounds
      ? Math.max(0, (1 - trackDist / CONFIG.ROAD_WIDTH) * CONFIG.REWARD_TRACK_CENTER_REWARD)
      : 0;
  const total = isCollision
    ? collisionPenalty
    : isOutOfBounds
      ? outOfBoundsPenalty
      : stepPenalty + speedReward + centerlineReward;

  return {
    carX,
    carZ,
    carAngleDeg: wrappedAngle,
    speed,
    action,
    closestPoint: closest.point,
    closestTangent: closest.tangent,
    trackDist,
    signedLateralOffset: closest.signedLateral,
    dxToCenter,
    dzToCenter,
    rays,
    vector,
    dimensions,
    reward: {
      stepPenalty,
      speedReward,
      centerlineReward,
      collisionPenalty,
      outOfBoundsPenalty,
      total,
      isCollision,
      isOutOfBounds,
    },
  };
}
