import { FIGURE_FONT_FAMILY } from '../../utils/figureFont';
import { CONFIG, ObservationSnapshot } from '../sim/rlRacingMath';
import {
  CalloutSpec,
  LayerVisibility,
  ProjectedSceneAnchors,
  buildCalloutLayout,
} from './calloutLayout';

export interface RenderedDiagramResult {
  dataUrl: string;
  width: number;
  height: number;
  timestamp: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  size: number,
  color: string,
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Composites a publication-grade 2400x1440 high-resolution annotated technical figure PNG:
 * - Top academic header bar (Project title, Box(16,) + Discrete(7) + 9-Ray LiDAR specs)
 * - Main 3D WebGL scene capture with crisp vector leader arrows pointing to the tire speed,
 *   LiDAR hit/clear rays with distances, centerline vector, heading yaw, and AABB obstacles
 * - Bottom 16-D Observation Vector Box(16,) full telemetry matrix + reward equation footer
 */
export function compositePublicationDiagram(
  sourceCanvas: HTMLCanvasElement,
  anchors: ProjectedSceneAnchors,
  snapshot: ObservationSnapshot,
  layers: LayerVisibility,
  darkMode: boolean,
  scenarioTitle: string,
): RenderedDiagramResult {
  const outW = 2400;
  const headerH = 112;
  const sceneH = 1090;
  const footerH = 238;
  const outH = headerH + sceneH + footerH;

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d')!;

  const bgPrimary = darkMode ? '#0b1120' : '#f8fafc';
  const bgSurface = darkMode ? '#111827' : '#ffffff';
  const borderCol = darkMode ? '#1e293b' : '#cbd5e1';
  const inkPrimary = darkMode ? '#f1f5f9' : '#0f172a';
  const inkMuted = darkMode ? '#94a3b8' : '#475569';

  // Background fill
  ctx.fillStyle = bgPrimary;
  ctx.fillRect(0, 0, outW, outH);

  // ===================================================
  // 1. TOP PUBLICATION HEADER BAR
  // ===================================================
  ctx.fillStyle = bgSurface;
  ctx.fillRect(0, 0, outW, headerH);
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(outW, headerH);
  ctx.stroke();

  ctx.fillStyle = inkPrimary;
  ctx.font = `700 32px ${FIGURE_FONT_FAMILY}`;
  ctx.fillText('RL Racing 3D · Observation Space and LiDAR', 48, 48);

  ctx.fillStyle = inkMuted;
  ctx.font = `500 19px ${FIGURE_FONT_FAMILY}`;
  ctx.fillText(
    `Scenario: ${scenarioTitle}   ·   PPO (MlpPolicy)   ·   Box(16,) observation   ·   Action #${snapshot.action.id}: ${snapshot.action.label}`,
    48,
    86,
  );

  // Right-aligned legend cleanly positioned on top row with zero overlap
  const legendItems = [
    { label: 'Hit ray', color: '#dc2626' },
    { label: 'Clear ray', color: '#0284c7' },
    { label: 'Tire velocity', color: '#059669' },
    { label: 'Centerline offset', color: '#7c3aed' },
    { label: 'Heading angle', color: '#d97706' },
  ];
  let lx = outW - 48;
  ctx.font = `600 18px ${FIGURE_FONT_FAMILY}`;
  for (let i = legendItems.length - 1; i >= 0; i--) {
    const item = legendItems[i];
    const tw = ctx.measureText(item.label).width;
    lx -= tw;
    ctx.fillStyle = inkPrimary;
    ctx.fillText(item.label, lx, 52);
    lx -= 24;
    ctx.fillStyle = item.color;
    drawRoundedRect(ctx, lx, 37, 16, 16, 4);
    ctx.fill();
    lx -= 24;
  }

  // ===================================================
  // 2. DRAW 3D SCENE VIEWPORT (COVER-FITTED CLEANLY)
  // ===================================================
  const srcW = sourceCanvas.width || 1;
  const srcH = sourceCanvas.height || 1;
  const srcAspect = srcW / srcH;
  const dstAspect = outW / sceneH;

  let drawX = 0;
  let drawY = headerH;
  let drawW = outW;
  let drawH = sceneH;
  let cropX = 0;
  let cropY = 0;
  let cropW = srcW;
  let cropH = srcH;

  if (srcAspect > dstAspect) {
    // Source wider: crop horizontally
    cropW = srcH * dstAspect;
    cropX = (srcW - cropW) * 0.5;
  } else {
    // Source taller: crop vertically
    cropH = srcW / dstAspect;
    cropY = (srcH - cropH) * 0.5;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, headerH, outW, sceneH);
  ctx.clip();
  ctx.drawImage(sourceCanvas, cropX, cropY, cropW, cropH, drawX, drawY, drawW, drawH);

  // Map original normalized [0,1] viewport coords into the cropped scene canvas coords
  const mapNormToCanvas = (u: number, v: number) => {
    const pxInSrc = u * srcW;
    const pyInSrc = v * srcH;
    const cx = ((pxInSrc - cropX) / cropW) * outW;
    const cy = headerH + ((pyInSrc - cropY) / cropH) * sceneH;
    return { x: cx, y: cy };
  };

  // Pre-compute callout bounding boxes so ray micro-badges never collide with them
  const callouts: CalloutSpec[] = buildCalloutLayout(anchors, snapshot, layers);
  const cardW = 450;
  const cardH = 82;
  const calloutRects = callouts.map((c) => ({
    x: c.side === 'left' ? 44 : outW - 44 - cardW,
    y: headerH + c.boxY * sceneH,
    w: cardW,
    h: cardH,
  }));

  const overlapsCallout = (bx: number, by: number, bw: number, bh: number) =>
    calloutRects.some(
      (r) =>
        bx < r.x + r.w + 14 &&
        bx + bw > r.x - 14 &&
        by < r.y + r.h + 10 &&
        by + bh > r.y - 10,
    );

  // ===================================================
  // 3. INDIVIDUAL RAY ANGLE & DISTANCE MICRO-BADGES
  // ===================================================
  if (layers.rays && layers.rayBadges) {
    ctx.font = `600 17px ${FIGURE_FONT_FAMILY}`;
    for (const tip of anchors.rayTips) {
      if (!tip.visible) continue;
      const pt = mapNormToCanvas(tip.x, tip.y);
      if (pt.x < 90 || pt.x > outW - 90 || pt.y < headerH + 34 || pt.y > headerH + sceneH - 34) {
        continue;
      }
      const sign = tip.angleDeg > 0 ? `+${tip.angleDeg}°` : `${tip.angleDeg}°`;
      const label = tip.hit ? `${sign} · ${tip.distance.toFixed(1)}m` : `${sign} · 80m`;
      const tw = ctx.measureText(label).width;
      const bw = tw + 20;
      const bh = 28;
      const bx = pt.x - bw * 0.5;
      const by = pt.y - bh - 12;

      if (overlapsCallout(bx, by, bw, bh)) continue;

      ctx.fillStyle = tip.hit
        ? darkMode
          ? 'rgba(153, 27, 27, 0.94)'
          : 'rgba(220, 38, 38, 0.94)'
        : darkMode
          ? 'rgba(12, 74, 110, 0.90)'
          : 'rgba(255, 255, 255, 0.92)';
      drawRoundedRect(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.strokeStyle = tip.hit ? '#fca5a5' : '#0284c7';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.fillStyle = tip.hit ? '#ffffff' : darkMode ? '#e0f2fe' : '#0369a1';
      ctx.fillText(label, bx + 10, by + 20);
    }
  }

  // ===================================================
  // 4. TECHNICAL CALLOUT CARDS & VECTOR LEADER ARROWS
  // ===================================================
  for (const c of callouts) {
    const anchorPt = mapNormToCanvas(c.anchorX, c.anchorY);
    const boxX = c.side === 'left' ? 44 : outW - 44 - cardW;
    const boxY = headerH + c.boxY * sceneH;

    const startX = c.side === 'left' ? boxX + cardW : boxX;
    const startY = boxY + cardH * 0.5;
    const elbowX = c.side === 'left' ? startX + 38 : startX - 38;

    // Subtle white/dark halo behind leader line for 100% legibility over 3D track
    ctx.strokeStyle = darkMode ? 'rgba(11, 17, 32, 0.85)' : 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(elbowX, startY);
    ctx.lineTo(anchorPt.x, anchorPt.y);
    ctx.stroke();

    // Colored leader arrow shaft
    ctx.strokeStyle = c.accentHex;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(elbowX, startY);
    ctx.lineTo(anchorPt.x, anchorPt.y);
    ctx.stroke();

    // Crisp target arrowhead pointing directly at the 3D element (e.g., tire or ray)
    drawArrowhead(ctx, elbowX, startY, anchorPt.x, anchorPt.y, 17, c.accentHex);

    // Target ring at anchor point
    ctx.beginPath();
    ctx.arc(anchorPt.x, anchorPt.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = c.accentHex;
    ctx.stroke();

    // Callout card body (clean solid surface + subtle hairline border, no thick left bar)
    ctx.fillStyle = darkMode ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.95)';
    drawRoundedRect(ctx, boxX, boxY, cardW, cardH, 10);
    ctx.fill();
    ctx.strokeStyle = darkMode ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Top row: observation index and callout title
    ctx.fillStyle = c.accentHex;
    ctx.font = `700 18px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(c.obsTag, boxX + 18, boxY + 32);

    const tagW = ctx.measureText(c.obsTag).width;
    ctx.fillStyle = inkPrimary;
    ctx.font = `700 22px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(c.title, boxX + 28 + tagW, boxY + 32);

    // Value readout
    ctx.fillStyle = inkPrimary;
    ctx.font = `600 19px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(c.valueText, boxX + 18, boxY + 62);
  }
  ctx.restore();

  // ===================================================
  // 5. BOTTOM 16-D OBSERVATION VECTOR TABLE & REWARD BAR
  // ===================================================
  const footY = headerH + sceneH;
  ctx.fillStyle = bgSurface;
  ctx.fillRect(0, footY, outW, footerH);
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, footY);
  ctx.lineTo(outW, footY);
  ctx.stroke();

  ctx.fillStyle = inkPrimary;
  ctx.font = `700 21px ${FIGURE_FONT_FAMILY}`;
  ctx.fillText('16-D Normalized Observation Vector', 48, footY + 38);

  // Reward summary right side of footer header
  const r = snapshot.reward;
  const rewardSummary = `Step Reward R = ${r.total >= 0 ? '+' : ''}${r.total.toFixed(2)}   [ Step ${r.stepPenalty.toFixed(1)} | Speed +${r.speedReward.toFixed(2)} (v×2.5) | Center +${r.centerlineReward.toFixed(2)} | Collision/OOB -100 ]`;
  ctx.fillStyle = inkMuted;
  ctx.font = `600 17px ${FIGURE_FONT_FAMILY}`;
  const rw = ctx.measureText(rewardSummary).width;
  ctx.fillText(rewardSummary, outW - 48 - rw, footY + 38);

  // 16 compact columns for obs[0]..obs[15]
  const marginX = 48;
  const gap = 8;
  const cellW = (outW - marginX * 2 - gap * 15) / 16;
  const cellY = footY + 56;
  const cellH = 152;

  const groupColors: Record<string, string> = {
    position: '#2563eb',
    heading: '#d97706',
    speed: '#059669',
    centerline: '#7c3aed',
    lidar: '#0284c7',
  };

  snapshot.dimensions.forEach((dim, i) => {
    const cx = marginX + i * (cellW + gap);
    const isHitRay = dim.group === 'lidar' && snapshot.rays[i - 7]?.hit;
    const accent = isHitRay ? '#dc2626' : groupColors[dim.group];

    ctx.fillStyle = darkMode ? '#1e293b' : '#f1f5f9';
    drawRoundedRect(ctx, cx, cellY, cellW, cellH, 8);
    ctx.fill();
    ctx.strokeStyle = isHitRay ? '#ef4444' : borderCol;
    ctx.lineWidth = isHitRay ? 2 : 1;
    ctx.stroke();

    // Index
    ctx.fillStyle = accent;
    ctx.font = `700 15px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(`[${i}]`, cx + 10, cellY + 24);

    // Key / angle
    ctx.fillStyle = inkPrimary;
    ctx.font = `600 15px ${FIGURE_FONT_FAMILY}`;
    const shortName =
      dim.group === 'lidar'
        ? `${snapshot.rays[i - 7].angleDeg >= 0 ? '+' : ''}${snapshot.rays[i - 7].angleDeg}°`
        : dim.key.replace('track_', '');
    ctx.fillText(shortName, cx + 10, cellY + 50);

    // Raw value
    ctx.fillStyle = inkMuted;
    ctx.font = `500 13px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(dim.rawDisplay, cx + 10, cellY + 76);

    // Formula
    ctx.fillStyle = inkMuted;
    ctx.font = `400 12px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(dim.formula, cx + 10, cellY + 98);

    // Normalized numeric readout
    ctx.fillStyle = isHitRay ? '#dc2626' : inkPrimary;
    ctx.font = `700 18px ${FIGURE_FONT_FAMILY}`;
    ctx.fillText(dim.normalized.toFixed(3), cx + 10, cellY + 132);
  });

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: outW,
    height: outH,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };
}
