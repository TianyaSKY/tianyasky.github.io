import { ObservationSnapshot, CONFIG } from '../sim/rlRacingMath';

export interface ScreenAnchor {
  x: number; // normalized [0, 1] across viewport width
  y: number; // normalized [0, 1] across viewport height
  visible: boolean;
}

export interface RayScreenPoint extends ScreenAnchor {
  angleDeg: number;
  obsIndex: number;
  distance: number;
  normalized: number;
  hit: boolean;
}

export interface ProjectedSceneAnchors {
  tireSpeed: ScreenAnchor;
  centerlineVec: ScreenAnchor;
  headingArc: ScreenAnchor;
  worldOrigin: ScreenAnchor;
  primaryHitRay: (ScreenAnchor & { angleDeg: number; obsIndex: number; distance: number; normalized: number }) | null;
  secondaryHitRay: (ScreenAnchor & { angleDeg: number; obsIndex: number; distance: number; normalized: number }) | null;
  clearFanRay: (ScreenAnchor & { angleDeg: number; obsIndex: number; distance: number; normalized: number }) | null;
  obstacleBox: ScreenAnchor | null;
  offRoadBoundary: ScreenAnchor;
  rayTips: RayScreenPoint[];
}

export interface CalloutSpec {
  id: string;
  obsTag: string;      // e.g. "obs[3]"
  title: string;
  valueText: string;   // e.g. "v = 0.68 / 0.80 → 0.850"
  accentHex: string;
  anchorX: number;     // [0, 1]
  anchorY: number;     // [0, 1]
  boxX: number;        // [0, 1] top-left
  boxY: number;        // [0, 1] top-left
  side: 'left' | 'right';
}

export interface LayerVisibility {
  rays: boolean;
  speedArrow: boolean;
  centerline: boolean;
  headingAndPos: boolean;
  aabbBoxes: boolean;
  callouts: boolean;
  rayBadges: boolean;
}

/**
 * Deterministic side-margin slot placer so technical callouts NEVER overlap each other
 * and NEVER cover the central 3D race car silhouette.
 */
export function buildCalloutLayout(
  anchors: ProjectedSceneAnchors,
  snapshot: ObservationSnapshot,
  layers: LayerVisibility,
): CalloutSpec[] {
  if (!layers.callouts) return [];

  type RawItem = Omit<CalloutSpec, 'boxX' | 'boxY' | 'side'> & { preferredSide: 'left' | 'right' };
  const raw: RawItem[] = [];

  // 1. Tire Velocity Arrow (Explicitly requested by user: arrow pointing to tire explaining speed)
  if (layers.speedArrow && anchors.tireSpeed.visible) {
    raw.push({
      id: 'tire-speed',
      obsTag: 'obs[3]',
      title: 'Tire velocity',
      valueText: `${snapshot.speed.toFixed(2)} / ${CONFIG.CAR_BASE_SPEED.toFixed(1)} = ${snapshot.vector[3].toFixed(3)}`,
      accentHex: '#059669',
      anchorX: anchors.tireSpeed.x,
      anchorY: anchors.tireSpeed.y,
      preferredSide: anchors.tireSpeed.x < 0.36 ? 'left' : 'right',
    });
  }

  // 2. Primary Obstacle-Hit LiDAR Ray
  if (layers.rays && anchors.primaryHitRay && anchors.primaryHitRay.visible) {
    const r = anchors.primaryHitRay;
    const sign = r.angleDeg > 0 ? `+${r.angleDeg}°` : `${r.angleDeg}°`;
    raw.push({
      id: 'lidar-hit-primary',
      obsTag: `obs[${r.obsIndex}]`,
      title: `Hit ray (${sign})`,
      valueText: `d = ${r.distance.toFixed(1)}m / 80m = ${r.normalized.toFixed(3)}`,
      accentHex: '#dc2626',
      anchorX: r.x,
      anchorY: r.y,
      preferredSide: r.x < 0.52 ? 'left' : 'right',
    });
  }

  // 3. Secondary Hit Ray OR Clear Fan Ray
  if (layers.rays && anchors.clearFanRay && anchors.clearFanRay.visible) {
    const r = anchors.clearFanRay;
    const sign = r.angleDeg > 0 ? `+${r.angleDeg}°` : `${r.angleDeg}°`;
    raw.push({
      id: 'lidar-clear',
      obsTag: `obs[${r.obsIndex}]`,
      title: `Clear ray (${sign})`,
      valueText: `d = 80.0m (Max) → 1.000`,
      accentHex: '#0284c7',
      anchorX: r.x,
      anchorY: r.y,
      preferredSide: r.x < 0.48 ? 'left' : 'right',
    });
  }

  // 4. Centerline Offset & Direction Vector (obs[4..6])
  if (layers.centerline && anchors.centerlineVec.visible) {
    raw.push({
      id: 'centerline-vec',
      obsTag: 'obs[4..6]',
      title: 'Centerline offset',
      valueText: `d = ${snapshot.trackDist.toFixed(2)}m → ${snapshot.vector[4].toFixed(3)}`,
      accentHex: '#7c3aed',
      anchorX: anchors.centerlineVec.x,
      anchorY: anchors.centerlineVec.y,
      preferredSide: anchors.centerlineVec.x < 0.5 ? 'left' : 'right',
    });
  }

  // 5. Heading Angle θ (obs[2])
  if (layers.headingAndPos && anchors.headingArc.visible) {
    raw.push({
      id: 'heading-angle',
      obsTag: 'obs[2]',
      title: 'Heading angle θ',
      valueText: `θ = ${snapshot.carAngleDeg.toFixed(1)}° → ${snapshot.vector[2].toFixed(3)}`,
      accentHex: '#d97706',
      anchorX: anchors.headingArc.x,
      anchorY: anchors.headingArc.y,
      preferredSide: anchors.headingArc.x < 0.5 ? 'left' : 'right',
    });
  }

  // 6. World Position (x, z) (obs[0..1])
  if (layers.headingAndPos && anchors.worldOrigin.visible) {
    raw.push({
      id: 'world-pos',
      obsTag: 'obs[0..1]',
      title: 'World position (x, z)',
      valueText: `(${snapshot.carX.toFixed(1)}, ${snapshot.carZ.toFixed(1)}) → (${snapshot.vector[0].toFixed(2)}, ${snapshot.vector[1].toFixed(2)})`,
      accentHex: '#2563eb',
      anchorX: anchors.worldOrigin.x,
      anchorY: anchors.worldOrigin.y,
      preferredSide: anchors.worldOrigin.x < 0.5 ? 'left' : 'right',
    });
  }

  // 7. Obstacle AABB Collision Box (-100)
  if (layers.aabbBoxes && anchors.obstacleBox && anchors.obstacleBox.visible) {
    raw.push({
      id: 'obstacle-aabb',
      obsTag: 'R = -100',
      title: 'Obstacle AABB',
      valueText: 'Collision → Done (-100)',
      accentHex: '#b45309',
      anchorX: anchors.obstacleBox.x,
      anchorY: anchors.obstacleBox.y,
      preferredSide: anchors.obstacleBox.x < 0.5 ? 'left' : 'right',
    });
  }

  // Partition into left & right columns, rebalance if one column has > 4 items
  const leftItems: RawItem[] = [];
  const rightItems: RawItem[] = [];
  for (const item of raw) {
    if (item.preferredSide === 'left') leftItems.push(item);
    else rightItems.push(item);
  }

  while (leftItems.length > 4) {
    // Move the rightmost anchor from left column to right column
    leftItems.sort((a, b) => b.anchorX - a.anchorX);
    rightItems.push(leftItems.shift()!);
  }
  while (rightItems.length > 4) {
    rightItems.sort((a, b) => a.anchorX - b.anchorX);
    leftItems.push(rightItems.shift()!);
  }

  // Sort each side vertically by anchorY to minimize crossing leader lines
  leftItems.sort((a, b) => a.anchorY - b.anchorY);
  rightItems.sort((a, b) => a.anchorY - b.anchorY);

  const placed: CalloutSpec[] = [];
  const slotMinY = 0.14;
  const slotMaxY = 0.72;
  const minGap = 0.135;

  const placeColumn = (items: RawItem[], side: 'left' | 'right') => {
    if (items.length === 0) return;
    const ys = items.map((it) => Math.max(slotMinY, Math.min(slotMaxY, it.anchorY - 0.045)));
    // Forward pass: enforce minimum vertical spacing
    for (let i = 1; i < ys.length; i++) {
      if (ys[i] - ys[i - 1] < minGap) {
        ys[i] = ys[i - 1] + minGap;
      }
    }
    // Backward pass: clamp to bottom safe margin (above bottom control dock)
    const overflow = ys[ys.length - 1] - slotMaxY;
    if (overflow > 0) {
      for (let i = 0; i < ys.length; i++) {
        ys[i] = Math.max(slotMinY + i * (minGap * 0.88), ys[i] - overflow);
      }
    }

    const boxX = side === 'left' ? 0.024 : 0.785;
    items.forEach((it, idx) => {
      placed.push({
        id: it.id,
        obsTag: it.obsTag,
        title: it.title,
        valueText: it.valueText,
        accentHex: it.accentHex,
        anchorX: it.anchorX,
        anchorY: it.anchorY,
        boxX,
        boxY: ys[idx],
        side,
      });
    });
  };

  placeColumn(leftItems, 'left');
  placeColumn(rightItems, 'right');
  return placed;
}
