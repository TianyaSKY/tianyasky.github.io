import React, { useMemo } from 'react';
import { ObservationSnapshot } from '../sim/rlRacingMath';
import {
  LayerVisibility,
  ProjectedSceneAnchors,
  buildCalloutLayout,
} from '../render/calloutLayout';

interface DiagramCalloutLayerProps {
  anchors: ProjectedSceneAnchors | null;
  snapshot: ObservationSnapshot;
  layers: LayerVisibility;
  darkMode: boolean;
  viewportSize: { width: number; height: number };
}

export const DiagramCalloutLayer: React.FC<DiagramCalloutLayerProps> = ({
  anchors,
  snapshot,
  layers,
  darkMode,
  viewportSize,
}) => {
  const callouts = useMemo(() => {
    if (!anchors) return [];
    return buildCalloutLayout(anchors, snapshot, layers);
  }, [anchors, snapshot, layers]);

  if (!anchors || viewportSize.width < 640) return null;

  const { width, height } = viewportSize;
  const cardW = Math.min(252, Math.max(204, width * 0.18));
  const cardH = 66;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
      data-testid="diagram-callout-layer"
    >
      {/* Vector leader lines with arrowheads pointing directly to 3D anchors */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0"
      >
        <defs>
          {callouts.map((c) => (
            <marker
              key={`arrow-${c.id}`}
              id={`arrow-${c.id}`}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={c.accentHex} />
            </marker>
          ))}
        </defs>

        {callouts.map((c) => {
          const ax = c.anchorX * width;
          const ay = c.anchorY * height;
          const bx = c.side === 'left' ? 20 : width - 20 - cardW;
          const by = c.boxY * height;
          const sx = c.side === 'left' ? bx + cardW : bx;
          const sy = by + cardH * 0.5;
          const elbowX = c.side === 'left' ? sx + 22 : sx - 22;
          const pathD = `M ${sx} ${sy} L ${elbowX} ${sy} L ${ax} ${ay}`;

          return (
            <g key={c.id}>
              {/* Contrast halo */}
              <path
                d={pathD}
                fill="none"
                stroke={darkMode ? 'rgba(9, 13, 24, 0.85)' : 'rgba(255, 255, 255, 0.88)'}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Colored leader arrow */}
              <path
                d={pathD}
                fill="none"
                stroke={c.accentHex}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={`url(#arrow-${c.id})`}
              />
              {/* Anchor dot */}
              <circle
                cx={ax}
                cy={ay}
                r="4.2"
                fill="#ffffff"
                stroke={c.accentHex}
                strokeWidth="2.2"
              />
            </g>
          );
        })}
      </svg>

      {/* Individual ray angle & distance micro-tags along the 9 LiDAR fan endpoints */}
      {layers.rays &&
        layers.rayBadges &&
        anchors.rayTips.map((tip) => {
          if (!tip.visible) return null;
          const px = tip.x * width;
          const py = tip.y * height;
          if (px < 60 || px > width - 60 || py < 68 || py > height - 150) return null;

          // Avoid colliding with side callout cards
          const badgeW = 92;
          const badgeH = 24;
          const bx1 = px - badgeW * 0.5;
          const by1 = py - 22 - badgeH * 0.5;
          const hitsCard = callouts.some((c) => {
            const cx = c.side === 'left' ? 20 : width - 20 - cardW;
            const cy = c.boxY * height;
            return (
              bx1 < cx + cardW + 8 &&
              bx1 + badgeW > cx - 8 &&
              by1 < cy + cardH + 6 &&
              by1 + badgeH > cy - 6
            );
          });
          if (hitsCard) return null;

          const sign = tip.angleDeg > 0 ? `+${tip.angleDeg}°` : `${tip.angleDeg}°`;
          return (
            <div
              key={`ray-tip-${tip.obsIndex}`}
              style={{
                transform: `translate(${Math.round(px)}px, ${Math.round(py - 22)}px) translate(-50%, -50%)`,
              }}
              className={`absolute top-0 left-0 px-1.5 py-0.5 rounded text-[11px] font-mono-tabular font-semibold whitespace-nowrap border ${
                tip.hit
                  ? 'bg-red-600 text-white border-red-300 shadow-sm'
                  : darkMode
                    ? 'bg-slate-900/92 text-sky-200 border-sky-500/60'
                    : 'bg-white/94 text-sky-800 border-sky-400/80 shadow-xs'
              }`}
            >
              {sign} · {tip.hit ? `${tip.distance.toFixed(1)}m` : '80m'}
            </div>
          );
        })}

      {/* Side-column technical callout cards (zero viewport center occlusion) */}
      {callouts.map((c) => {
        const bx = c.side === 'left' ? 20 : width - 20 - cardW;
        const by = c.boxY * height;
        return (
          <div
            key={c.id}
            style={{
              width: `${cardW}px`,
              transform: `translate(${Math.round(bx)}px, ${Math.round(by)}px)`,
            }}
            className={`absolute top-0 left-0 rounded-lg px-3 py-2 border shadow-sm ${
              darkMode
                ? 'bg-slate-950/92 border-slate-700 text-slate-100'
                : 'bg-white/95 border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-semibold tracking-tight truncate">
                {c.titleZh}
              </span>
              <span
                className="text-[11px] font-mono-tabular font-bold shrink-0"
                style={{ color: c.accentHex }}
              >
                {c.obsTag}
              </span>
            </div>
            <div
              className={`text-[11px] font-mono-tabular mt-0.5 truncate ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {c.valueText}
            </div>
          </div>
        );
      })}
    </div>
  );
};
