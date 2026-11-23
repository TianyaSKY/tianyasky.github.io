import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import {
  DEFAULT_STRUCTURE_PARAMS,
  SEMANTIC_BACKGROUND_NOTE,
  type CameraIntrinsics,
  type LandmarkSpec,
  type LayerVisibility,
  type StructureLayoutPreset,
  type StructureParams,
  type VirtualCameraState,
} from '../data/visionPositioningConfig';
import {
  analyzeRayAnglePair,
  computeCameraBasis,
  projectLandmarkToImage,
} from '../geometry/visionMath';
import { SensorPreviewSvg } from './SensorPreviewSvg';
import type { SelectedSceneObject } from './VisionSceneCanvas';

export type InspectorTab = 'inspect' | 'ray-angle' | 'layers';

interface SceneInspectorProps {
  open: boolean;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  onClose: () => void;
  landmarks: LandmarkSpec[];
  virtualCamera: VirtualCameraState;
  intrinsics: CameraIntrinsics;
  selectedObject: SelectedSceneObject;
  onSelectObject: (sel: SelectedSceneObject) => void;
  pairAId: number;
  pairBId: number;
  onPairAChange: (id: number) => void;
  onPairBChange: (id: number) => void;
  rayAngleMode: boolean;
  onToggleRayAngleMode: (next: boolean) => void;
  onUpdateVirtualCamera: (patch: Partial<VirtualCameraState>) => void;
  onUpdateVirtualCameraPos: (axis: 'x' | 'y' | 'z', value: number) => void;
  layers: LayerVisibility;
  onToggleLayer: (key: keyof LayerVisibility) => void;
  structureParams: StructureParams;
  onUpdateStructureParams: (patch: Partial<StructureParams>) => void;
  onResetCameraPose: () => void;
}

const LAYER_LABELS: Array<{ key: keyof LayerVisibility; label: string }> = [
  { key: 'landmarkLabels', label: 'Landmark Labels' },
  { key: 'cameraFrustum', label: 'Camera Frustum' },
  { key: 'cameraRays', label: 'Camera Rays' },
  { key: 'coordinateAxes', label: 'Coordinate Axes (X/Y/Z)' },
  { key: 'geometryWireframe', label: 'Geometry Wireframe' },
  { key: 'groundGrid', label: 'Ground Grid (Z = 0)' },
  { key: 'oceanAndEnvironment', label: 'Ocean & Environment' },
  { key: 'cameraTrajectory', label: 'Camera Trajectory' },
];

export function SceneInspector({
  open,
  activeTab,
  onTabChange,
  onClose,
  landmarks,
  virtualCamera,
  intrinsics,
  selectedObject,
  onSelectObject,
  pairAId,
  pairBId,
  onPairAChange,
  onPairBChange,
  rayAngleMode,
  onToggleRayAngleMode,
  onUpdateVirtualCamera,
  onUpdateVirtualCameraPos,
  layers,
  onToggleLayer,
  structureParams,
  onUpdateStructureParams,
  onResetCameraPose,
}: SceneInspectorProps) {
  if (!open) return null;

  const basis = computeCameraBasis(virtualCamera);
  const projections = landmarks.map((lm) => projectLandmarkToImage(lm, basis, intrinsics));
  const lmA = landmarks.find((l) => l.id === pairAId) ?? landmarks[0];
  const lmB = landmarks.find((l) => l.id === pairBId) ?? landmarks[5];
  const pairAnalysis = analyzeRayAnglePair(lmA, lmB, basis, intrinsics);

  const selectedLandmark =
    selectedObject?.type === 'landmark'
      ? landmarks.find((l) => l.id === selectedObject.id) ?? null
      : null;
  const selectedProj = selectedLandmark
    ? projections.find((p) => p.landmarkId === selectedLandmark.id) ?? null
    : null;

  const visibleCount = projections.filter((p) => p.visibleInFrame).length;

  return (
    <aside
      aria-label="Scene Inspector"
      className="pointer-events-auto fixed right-3 top-[66px] bottom-[74px] z-20 w-[308px] max-w-[calc(100vw-24px)] flex flex-col rounded-xl border border-slate-900/12 bg-white/95 shadow-lg text-slate-900 overflow-hidden"
    >
      {/* Inspector Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200/90 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-semibold tracking-tight text-slate-900 truncate">
            Scene Inspector
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Collapse Scene Inspector"
          className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Tabs */}
      <div
        role="tablist"
        aria-label="Inspector sections"
        className="grid grid-cols-3 gap-1 p-1 mx-3 mt-2 rounded-lg bg-slate-100 shrink-0"
      >
        {(
          [
            { id: 'inspect', label: 'Inspect' },
            { id: 'ray-angle', label: 'Ray-Angle' },
            { id: 'layers', label: 'Layers' },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-3">
        {/* =============================================================== */}
        {/* TAB 1: INSPECT (Selected Landmark / Virtual Camera / Sensor)    */}
        {/* =============================================================== */}
        {activeTab === 'inspect' && (
          <>
            {/* Quick Object Picker Strip */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Select 3D Target</span>
                <button
                  type="button"
                  onClick={() => onSelectObject({ type: 'camera' })}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                    selectedObject?.type === 'camera'
                      ? 'bg-sky-600 text-white'
                      : 'text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  Camera C
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {landmarks.map((lm) => {
                  const isSel = selectedLandmark?.id === lm.id;
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => onSelectObject({ type: 'landmark', id: lm.id })}
                      className={`py-1 px-1 rounded-md text-xs font-mono-num font-medium border transition-colors ${
                        isSel
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ID {lm.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Object Readout */}
            {selectedLandmark ? (
              <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Landmark ID {selectedLandmark.id}
                  </span>
                  <span className="text-[11px] text-slate-500">{selectedLandmark.pairLabel}</span>
                </div>

                <dl className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-xs">
                  <div>
                    <dt className="text-[10px] text-slate-500">World Position (Z-up)</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      ({selectedLandmark.worldPos.x.toFixed(1)},{' '}
                      {selectedLandmark.worldPos.y.toFixed(1)},{' '}
                      {selectedLandmark.worldPos.z.toFixed(1)}) m
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500">Elevation Height</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      z = {selectedLandmark.worldPos.z.toFixed(1)} m (
                      {selectedLandmark.tier === 'lower' ? 'Lower' : 'Upper'})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500">Semantic Class</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      Class {selectedLandmark.semanticClass}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500">Camera Sightline</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      {selectedProj ? `${selectedProj.distance.toFixed(2)} m` : '—'}
                    </dd>
                  </div>
                  {selectedProj && (
                    <div className="col-span-2">
                      <dt className="text-[10px] text-slate-500">Projected Image Pixel (u, v)</dt>
                      <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                        {selectedProj.visibleInFrame
                          ? `(${selectedProj.u.toFixed(1)}, ${selectedProj.v.toFixed(1)}) px · In Frame`
                          : 'Outside Camera Frustum'}
                      </dd>
                    </div>
                  )}
                </dl>

                <p className="text-[10px] leading-snug text-slate-500">
                  {SEMANTIC_BACKGROUND_NOTE.label}: Background only (not a 9th point). X/Y are
                  editable schematic approximations.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Virtual Monocular Camera C
                  </span>
                  <span className="font-mono-num text-[11px] text-slate-500">
                    FOV {intrinsics.fovDeg.toFixed(1)}°
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-xs">
                  <div className="col-span-2">
                    <dt className="text-[10px] text-slate-500">Optical Center C (World Z-up)</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      ({basis.position.x.toFixed(2)}, {basis.position.y.toFixed(2)},{' '}
                      {basis.position.z.toFixed(2)}) m
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[10px] text-slate-500">Forward Direction (+Zc)</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      ({basis.forward.x.toFixed(3)}, {basis.forward.y.toFixed(3)},{' '}
                      {basis.forward.z.toFixed(3)})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500">Heading / Pitch</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      {basis.yawDeg.toFixed(1)}° / {basis.pitchDeg.toFixed(1)}°
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500">Visible Landmarks</dt>
                    <dd className="font-mono-num text-[11px] font-medium text-slate-900">
                      {visibleCount} / 8
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Interactive Virtual Camera Position Controls */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Move Camera Center C
                </span>
                <button
                  type="button"
                  onClick={onResetCameraPose}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  Reset
                </button>
              </div>

              {(
                [
                  { axis: 'x', label: 'World X (East)', min: -24, max: 24, step: 0.2 },
                  { axis: 'y', label: 'World Y (Offshore)', min: -32, max: -7, step: 0.2 },
                  { axis: 'z', label: 'World Z (Elevation)', min: 1.4, max: 14, step: 0.1 },
                ] as const
              ).map((ctrl) => (
                <label key={ctrl.axis} className="block space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">{ctrl.label}</span>
                    <span className="font-mono-num font-medium text-slate-900">
                      {virtualCamera.position[ctrl.axis].toFixed(2)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={virtualCamera.position[ctrl.axis]}
                    onChange={(e) => onUpdateVirtualCameraPos(ctrl.axis, parseFloat(e.target.value))}
                    className="w-full precision-slider"
                  />
                </label>
              ))}
            </div>

            {/* Live 2D Sensor Plane Preview */}
            <div className="pt-2 border-t border-slate-200/80">
              <SensorPreviewSvg
                intrinsics={intrinsics}
                landmarks={landmarks}
                projections={projections}
                pairAId={pairAId}
                pairBId={pairBId}
                selectedLandmarkId={selectedLandmark?.id ?? null}
                onSelectLandmark={(id) => onSelectObject({ type: 'landmark', id })}
              />
            </div>
          </>
        )}

        {/* =============================================================== */}
        {/* TAB 2: RAY-ANGLE INVARIANCE ANALYSIS                            */}
        {/* =============================================================== */}
        {activeTab === 'ray-angle' && (
          <>
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div>
                <p className="text-xs font-semibold text-slate-900">Ray-Angle Highlight</p>
                <p className="text-[11px] text-slate-500">
                  Isolate unit back-projected rays & angular sector
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={rayAngleMode}
                aria-label="Toggle Ray-Angle visualization mode"
                onClick={() => onToggleRayAngleMode(!rayAngleMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  rayAngleMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    rayAngleMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Landmark Pair Selectors */}
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block space-y-1">
                <span className="text-[11px] font-medium text-slate-600">Landmark A</span>
                <select
                  value={pairAId}
                  onChange={(e) => onPairAChange(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {landmarks.map((lm) => (
                    <option key={lm.id} value={lm.id} disabled={lm.id === pairBId}>
                      ID {lm.id} (z={lm.worldPos.z}m)
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-[11px] font-medium text-slate-600">Landmark B</span>
                <select
                  value={pairBId}
                  onChange={(e) => onPairBChange(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {landmarks.map((lm) => (
                    <option key={lm.id} value={lm.id} disabled={lm.id === pairAId}>
                      ID {lm.id} (z={lm.worldPos.z}m)
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Dynamic Ray-Angle Invariance Metrics */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/90 p-3 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-medium text-slate-600">
                  World Sightline Angle θ_world
                </span>
                <span
                  data-testid="ray-angle-world-deg"
                  className="text-lg font-mono-num font-semibold text-slate-900"
                >
                  {pairAnalysis.worldAngleDeg.toFixed(2)}°
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-600">Back-Projected Pixel Ray θ_img</span>
                <span
                  data-testid="ray-angle-image-deg"
                  className="font-mono-num font-semibold text-amber-700"
                >
                  {pairAnalysis.imageRayAngleDeg.toFixed(2)}°
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs pt-1.5 border-t border-slate-200">
                <span className="text-slate-600">Invariance Residual |θ_w − θ_img|</span>
                <span
                  data-testid="ray-angle-residual"
                  className="font-mono-num font-semibold text-emerald-700"
                >
                  {pairAnalysis.angleResidualDeg.toFixed(3)}°
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-mono-num">
                <div>cos(θ) = {pairAnalysis.cosWorldAngle.toFixed(4)}</div>
                <div>|AB| = {pairAnalysis.chordDistanceAB.toFixed(2)} m</div>
                <div>|C−P{pairAId}| = {pairAnalysis.distanceA.toFixed(2)} m</div>
                <div>|C−P{pairBId}| = {pairAnalysis.distanceB.toFixed(2)} m</div>
              </div>
            </div>

            {/* Interactive Rotation Invariance Experiment */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Test Rotation Invariance
                </span>
                {(virtualCamera.yawOffsetDeg !== 0 ||
                  virtualCamera.pitchOffsetDeg !== 0 ||
                  virtualCamera.rollDeg !== 0) && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateVirtualCamera({
                        yawOffsetDeg: 0,
                        pitchOffsetDeg: 0,
                        rollDeg: 0,
                      })
                    }
                    className="text-[11px] font-medium text-sky-700 hover:underline"
                  >
                    Zero Rotation
                  </button>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Rotate camera orientation while holding optical center C fixed. Projected pixels
                move across the sensor, yet θ_img remains strictly invariant to camera rotation R.
              </p>

              <label className="block space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Camera Yaw Offset</span>
                  <span className="font-mono-num text-slate-900">
                    {virtualCamera.yawOffsetDeg.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={-24}
                  max={24}
                  step={0.5}
                  value={virtualCamera.yawOffsetDeg}
                  onChange={(e) =>
                    onUpdateVirtualCamera({ yawOffsetDeg: parseFloat(e.target.value) })
                  }
                  className="w-full precision-slider"
                />
              </label>

              <label className="block space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Camera Roll Angle</span>
                  <span className="font-mono-num text-slate-900">
                    {virtualCamera.rollDeg.toFixed(1)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={-25}
                  max={25}
                  step={0.5}
                  value={virtualCamera.rollDeg}
                  onChange={(e) => onUpdateVirtualCamera({ rollDeg: parseFloat(e.target.value) })}
                  className="w-full precision-slider"
                />
              </label>

              <SensorPreviewSvg
                intrinsics={intrinsics}
                landmarks={landmarks}
                projections={projections}
                pairAId={pairAId}
                pairBId={pairBId}
                selectedLandmarkId={selectedLandmark?.id ?? null}
                onSelectLandmark={(id) => onSelectObject({ type: 'landmark', id })}
              />
            </div>

            {/* Methodological Integrity Note */}
            <p className="text-[11px] leading-relaxed text-slate-500 pt-2 border-t border-slate-200/80">
              Forward projective demonstration computed directly from world landmarks and K⁻¹
              back-projection. Offline LM/TRF nonlinear solver optimization is not executed in this
              browser viewer.
            </p>
          </>
        )}

        {/* =============================================================== */}
        {/* TAB 3: LAYERS & EDITABLE SCHEMATIC STRUCTURE PARAMETERS         */}
        {/* =============================================================== */}
        {activeTab === 'layers' && (
          <>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-800">Visualization Layers</p>
              <div className="divide-y divide-slate-100">
                {LAYER_LABELS.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between py-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={layers[item.key]}
                      onChange={() => onToggleLayer(item.key)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">
                  Structure Parameters (Approx.)
                </p>
                <button
                  type="button"
                  onClick={() => onUpdateStructureParams(DEFAULT_STRUCTURE_PARAMS)}
                  className="text-[11px] font-medium text-sky-700 hover:underline"
                >
                  Defaults
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Vertical heights z = 4.0 m and z = 8.0 m match the research specification.
                Horizontal X/Y footprint parameters below are editable schematic approximations.
              </p>

              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                {(
                  [
                    { id: 'offshore-frame', label: '3D Frame' },
                    { id: 'linear-pier', label: 'Linear Array' },
                  ] as Array<{ id: StructureLayoutPreset; label: string }>
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onUpdateStructureParams({ layout: preset.id })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                      structureParams.layout === preset.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <label className="block space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Approx. Span X</span>
                  <span className="font-mono-num text-slate-900">
                    {structureParams.spanX.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={15}
                  step={0.5}
                  value={structureParams.spanX}
                  onChange={(e) =>
                    onUpdateStructureParams({ spanX: parseFloat(e.target.value) })
                  }
                  className="w-full precision-slider"
                />
              </label>

              {structureParams.layout === 'offshore-frame' && (
                <label className="block space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">Approx. Depth Y</span>
                    <span className="font-mono-num text-slate-900">
                      {structureParams.depthY.toFixed(1)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    step={0.5}
                    value={structureParams.depthY}
                    onChange={(e) =>
                      onUpdateStructureParams({ depthY: parseFloat(e.target.value) })
                    }
                    className="w-full precision-slider"
                  />
                </label>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
