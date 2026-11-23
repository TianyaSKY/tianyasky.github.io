/**
 * Research configuration, world-frame landmark specifications, and editable schematic parameters
 * for the Monocular Vision 3D Reconstruction System.
 *
 * Coordinate Convention:
 *   World Frame (Engineering Z-up, meters):
 *     +X: Alongshore East (right)
 *     +Y: Offshore North (depth into scene)
 *     +Z: Vertical Elevation above Mean Sea Level (Z = 0 m)
 *
 * Known Research Specification:
 *   - 8 semantic corner landmarks (IDs 0–7) organized in 4 vertical pillar pairs.
 *   - Lower tier elevation: Z = 4.0 m (IDs 0, 2, 4, 6)
 *   - Upper tier elevation: Z = 8.0 m (IDs 1, 3, 5, 7)
 *   - Semantic Class 8 represents Background (not a 9th 3D landmark).
 *
 * Schematic Approximations (explicitly marked and user-editable):
 *   - Horizontal X/Y footprint spans and coastal breakwater surroundings are schematic
 *     engineering approximations for interactive geometric visualization and are NOT
 *     field-surveyed ground-truth coordinates.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type StructureLayoutPreset = 'offshore-frame' | 'linear-pier';

export interface StructureParams {
  layout: StructureLayoutPreset;
  spanX: number; // total horizontal span along X (meters, approximate)
  depthY: number; // depth along Y for 3D frame (meters, approximate)
  lowerZ: number; // 4.0 m (from research specification)
  upperZ: number; // 8.0 m (from research specification)
}

export interface LandmarkSpec {
  id: number;
  pairIndex: number; // 1..4
  pairLabel: string;
  tier: 'lower' | 'upper';
  semanticClass: number; // 0..7 (8 = background)
  semanticLabel: string;
  worldPos: Vec3;
  isXYApproximate: boolean;
  colorHex: string;
}

export interface CameraIntrinsics {
  width: number; // image width in pixels
  height: number; // image height in pixels
  fx: number; // focal length x (px)
  fy: number; // focal length y (px)
  cx: number; // principal point x (px)
  cy: number; // principal point y (px)
  fovDeg: number; // vertical FOV derived from fy & height
}

export interface VirtualCameraState {
  position: Vec3; // Camera optical center C in World Z-up (m)
  lookAt: Vec3; // Nominal target point in World Z-up (m)
  yawOffsetDeg: number; // Extra yaw rotation around C (tests rotation invariance!)
  pitchOffsetDeg: number; // Extra pitch rotation around C (tests rotation invariance!)
  rollDeg: number; // Extra roll around optical axis (tests rotation invariance!)
}

export type ViewMode = 'realistic' | 'scientific';

export type CameraViewPreset =
  | 'default'
  | 'top'
  | 'front'
  | 'side'
  | 'isometric'
  | 'focus-structure'
  | 'from-camera';

export interface LayerVisibility {
  landmarkLabels: boolean;
  cameraFrustum: boolean;
  cameraRays: boolean;
  coordinateAxes: boolean;
  geometryWireframe: boolean;
  groundGrid: boolean;
  oceanAndEnvironment: boolean;
  cameraTrajectory: boolean;
}

export const DEFAULT_STRUCTURE_PARAMS: StructureParams = {
  layout: 'offshore-frame',
  spanX: 9.0,
  depthY: 6.0,
  lowerZ: 4.0,
  upperZ: 8.0,
};

export const DEFAULT_CAMERA_INTRINSICS: CameraIntrinsics = {
  width: 1280,
  height: 720,
  fx: 920,
  fy: 920,
  cx: 640,
  cy: 360,
  fovDeg: (2 * Math.atan(720 / (2 * 920)) * 180) / Math.PI, // ~42.7 deg vertical FOV
};

export const DEFAULT_VIRTUAL_CAMERA: VirtualCameraState = {
  position: { x: 8.6, y: -17.4, z: 3.9 },
  lookAt: { x: 0.0, y: 0.0, z: 5.8 },
  yawOffsetDeg: 0,
  pitchOffsetDeg: 0,
  rollDeg: 0,
};

export const DEFAULT_LAYERS: LayerVisibility = {
  landmarkLabels: true,
  cameraFrustum: true,
  cameraRays: true,
  coordinateAxes: true,
  geometryWireframe: false,
  groundGrid: false,
  oceanAndEnvironment: true,
  cameraTrajectory: true,
};

export const PAIR_COLORS: Record<number, { lower: string; upper: string }> = {
  1: { lower: '#0284c7', upper: '#38bdf8' }, // Group 1: Sky / Cobalt
  2: { lower: '#0d9488', upper: '#2dd4bf' }, // Group 2: Teal
  3: { lower: '#d97706', upper: '#fbbf24' }, // Group 3: Amber
  4: { lower: '#dc2626', upper: '#f87171' }, // Group 4: Vermilion
};

export const SEMANTIC_BACKGROUND_NOTE = {
  classId: 8,
  label: 'Class 8 — Background',
  description:
    'In the semantic corner segmentation head, Class 8 denotes non-landmark background pixels and is never reconstructed as a 9th 3D reference corner.',
};

/**
 * Computes the 8 landmark specifications in World Z-up coordinates from the editable structure params.
 * Lower tier Z = 4.0 m (IDs 0, 2, 4, 6), Upper tier Z = 8.0 m (IDs 1, 3, 5, 7).
 */
export function buildLandmarksFromParams(params: StructureParams): LandmarkSpec[] {
  const halfX = params.spanX / 2;
  const halfY = params.depthY / 2;

  // Four vertical pillar bases (X, Y) in World Z-up coordinates
  const pillarBases: Array<{ x: number; y: number; pairIndex: number; name: string }> =
    params.layout === 'offshore-frame'
      ? [
          { x: -halfX, y: -halfY, pairIndex: 1, name: 'Pillar 1 (Front-West)' },
          { x: halfX, y: -halfY, pairIndex: 2, name: 'Pillar 2 (Front-East)' },
          { x: halfX, y: halfY, pairIndex: 3, name: 'Pillar 3 (Rear-East)' },
          { x: -halfX, y: halfY, pairIndex: 4, name: 'Pillar 4 (Rear-West)' },
        ]
      : [
          { x: -halfX, y: 0, pairIndex: 1, name: 'Pillar 1 (West)' },
          { x: -halfX / 3, y: 0, pairIndex: 2, name: 'Pillar 2 (Center-West)' },
          { x: halfX / 3, y: 0, pairIndex: 3, name: 'Pillar 3 (Center-East)' },
          { x: halfX, y: 0, pairIndex: 4, name: 'Pillar 4 (East)' },
        ];

  const landmarks: LandmarkSpec[] = [];

  for (const base of pillarBases) {
    const lowerId = (base.pairIndex - 1) * 2;
    const upperId = lowerId + 1;
    const colors = PAIR_COLORS[base.pairIndex];

    landmarks.push({
      id: lowerId,
      pairIndex: base.pairIndex,
      pairLabel: base.name,
      tier: 'lower',
      semanticClass: lowerId,
      semanticLabel: `Corner Class ${lowerId} (Lower z=${params.lowerZ.toFixed(1)}m)`,
      worldPos: {
        x: Number(base.x.toFixed(3)),
        y: Number(base.y.toFixed(3)),
        z: params.lowerZ,
      },
      isXYApproximate: true,
      colorHex: colors.lower,
    });

    landmarks.push({
      id: upperId,
      pairIndex: base.pairIndex,
      pairLabel: base.name,
      tier: 'upper',
      semanticClass: upperId,
      semanticLabel: `Corner Class ${upperId} (Upper z=${params.upperZ.toFixed(1)}m)`,
      worldPos: {
        x: Number(base.x.toFixed(3)),
        y: Number(base.y.toFixed(3)),
        z: params.upperZ,
      },
      isXYApproximate: true,
      colorHex: colors.upper,
    });
  }

  return landmarks;
}

export const RESEARCH_OVERVIEW_CONTENT = {
  title: 'Monocular Vision 3D Reconstruction System',
  subtitle: 'Nearshore 3D Camera Positioning via Semantic Landmarks & Ray-Angle Invariance',
  repoUrl: 'https://github.com/TianyaSKY/tianyasky.github.io',
  projectUrl: 'https://tianyasky.github.io/projects/vision-positioning/',
  summary:
    'A single-camera nearshore spatial positioning framework combining semantic structural corner detection with rotation-invariant ray-angle geometric constraints to recover the camera optical center C in world coordinates without stereo baselines or external GNSS aids.',
  pipelineSteps: [
    {
      index: '01',
      title: 'Cascade Semantic Corner Localization',
      detail:
        'Detects the 8 known structural corner landmarks (Classes 0–7) from a single monocular coastal image while classifying surrounding sea, sky, and structural clutter as Class 8 (Background).',
    },
    {
      index: '02',
      title: 'Pinhole Back-Projection to Unit Rays',
      detail:
        'Using calibrated camera intrinsics K, each detected 2D pixel coordinate (u_i, v_i) is mapped to a unit bearing vector d_i = normalize(K⁻¹ [u_i, v_i, 1]ᵀ) in the camera frame.',
    },
    {
      index: '03',
      title: 'Ray-Angle Invariance Constraint',
      detail:
        'Because pure camera rotation R preserves inner products, the pairwise inter-ray angle θ_ij = arccos(d_i · d_j) equals the world sightline angle between (P_i − C) and (P_j − C) regardless of camera orientation.',
    },
    {
      index: '04',
      title: '3D Optical Center Estimation',
      detail:
        'Pairwise angle residuals across visible landmark pairs constrain the 3D position C = (X, Y, Z) in the world frame, decoupling translation estimation from roll/pitch/yaw disturbances caused by vessel motion.',
    },
  ],
  honestyDisclaimers: [
    'Landmark tier heights (z = 4.0 m lower, z = 8.0 m upper) and 8-point vertical pairing (IDs 0–7, Class 8 = background) match the research specification.',
    'Horizontal X/Y pillar footprint dimensions and the coastal horizon backdrop are editable schematic approximations and do not represent surveyed field coordinates.',
    'This interactive browser viewer demonstrates exact forward projective geometry and ray-angle invariance in real time; it does not execute the offline LM/TRF nonlinear solver or claim live field accuracy metrics.',
    'The animated camera path is a deterministic Simulation Demo trajectory generated for interactive exploration.',
  ],
};
