import type {
  CameraIntrinsics,
  LandmarkSpec,
} from '../data/visionPositioningConfig';
import type { LandmarkProjection } from '../geometry/visionMath';

interface SensorPreviewSvgProps {
  intrinsics: CameraIntrinsics;
  landmarks: LandmarkSpec[];
  projections: LandmarkProjection[];
  pairAId: number;
  pairBId: number;
  selectedLandmarkId: number | null;
  onSelectLandmark: (id: number) => void;
}

/**
 * Live 2D monocular image sensor preview showing exact pinhole pixel projections (u_i, v_i)
 * of the 8 semantic corner landmarks and the active ray-angle pair.
 */
export function SensorPreviewSvg({
  intrinsics,
  landmarks,
  projections,
  pairAId,
  pairBId,
  selectedLandmarkId,
  onSelectLandmark,
}: SensorPreviewSvgProps) {
  const projById = new Map(projections.map((p) => [p.landmarkId, p]));
  const pA = projById.get(pairAId);
  const pB = projById.get(pairBId);
  const visibleCount = projections.filter((p) => p.visibleInFrame).length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-medium text-slate-800">Virtual Sensor Plane</span>
        <span className="font-mono-num text-[11px] text-slate-500">
          {visibleCount}/8 visible · {intrinsics.width}×{intrinsics.height}
        </span>
      </div>

      <div className="relative rounded-lg border border-slate-200 bg-slate-900 overflow-hidden">
        <svg
          viewBox={`0 0 ${intrinsics.width} ${intrinsics.height}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Monocular camera virtual image sensor showing projected 2D landmark pixels"
        >
          {/* Subtle sensor grid */}
          <line
            x1={intrinsics.cx}
            y1={0}
            x2={intrinsics.cx}
            y2={intrinsics.height}
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <line
            x1={0}
            y1={intrinsics.cy}
            x2={intrinsics.width}
            y2={intrinsics.cy}
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="2"
            strokeDasharray="10 10"
          />

          {/* Principal point crosshair */}
          <circle
            cx={intrinsics.cx}
            cy={intrinsics.cy}
            r="10"
            fill="none"
            stroke="rgba(56,189,248,0.45)"
            strokeWidth="2.5"
          />

          {/* Vertical structural pair guide lines on image sensor */}
          {[0, 2, 4, 6].map((lowId) => {
            const low = projById.get(lowId);
            const high = projById.get(lowId + 1);
            if (!low?.inFront || !high?.inFront) return null;
            return (
              <line
                key={lowId}
                x1={low.u}
                y1={low.v}
                x2={high.u}
                y2={high.v}
                stroke="rgba(148,163,184,0.38)"
                strokeWidth="3"
              />
            );
          })}

          {/* Highlighted ray-angle pair line between pixel A and pixel B */}
          {pA?.inFront && pB?.inFront && (
            <line
              x1={pA.u}
              y1={pA.v}
              x2={pB.u}
              y2={pB.v}
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="12 8"
            />
          )}

          {/* Projected 2D corner landmarks */}
          {landmarks.map((lm) => {
            const pr = projById.get(lm.id);
            if (!pr || !pr.visibleInFrame) return null;
            const isPair = lm.id === pairAId || lm.id === pairBId;
            const isSel = lm.id === selectedLandmarkId;
            return (
              <g
                key={lm.id}
                onClick={() => onSelectLandmark(lm.id)}
                style={{ cursor: 'pointer' }}
              >
                {(isPair || isSel) && (
                  <circle
                    cx={pr.u}
                    cy={pr.v}
                    r={isSel ? 26 : 22}
                    fill="none"
                    stroke={isSel ? '#ffffff' : '#f59e0b'}
                    strokeWidth="4"
                  />
                )}
                <circle
                  cx={pr.u}
                  cy={pr.v}
                  r="13"
                  fill={lm.colorHex}
                  stroke="#0f172a"
                  strokeWidth="3"
                />
                <text
                  x={pr.u + 18}
                  y={pr.v - 10}
                  fill="#f8fafc"
                  fontSize="34"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {lm.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
