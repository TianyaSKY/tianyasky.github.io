import { ArrowUpRight, Maximize2 } from 'lucide-react';
import {
  RESEARCH_OVERVIEW_CONTENT,
  SEMANTIC_BACKGROUND_NOTE,
  type CameraIntrinsics,
  type LandmarkSpec,
  type LayerVisibility,
  type StructureParams,
  type ViewMode,
  type VirtualCameraState,
} from '../data/visionPositioningConfig';
import { VisionSceneCanvas, type SelectedSceneObject } from './VisionSceneCanvas';

interface ResearchOverviewProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  layers: LayerVisibility;
  structureParams: StructureParams;
  landmarks: LandmarkSpec[];
  virtualCamera: VirtualCameraState;
  intrinsics: CameraIntrinsics;
  selectedObject: SelectedSceneObject;
  pairAId: number;
  pairBId: number;
  rayAngleMode: boolean;
  onSelectObject: (sel: SelectedSceneObject, shiftKey?: boolean) => void;
  onLaunchFullscreenViewer: () => void;
}

/**
 * Embedded Research Project Detail Page (/projects/vision-positioning) matching the
 * clean academic presentation style, hosting an interactive embedded 3D scene preview
 * plus direct entry to the Fullscreen 3D Viewer.
 */
export function ResearchOverview({
  mode,
  onModeChange,
  layers,
  structureParams,
  landmarks,
  virtualCamera,
  intrinsics,
  selectedObject,
  pairAId,
  pairBId,
  rayAngleMode,
  onSelectObject,
  onLaunchFullscreenViewer,
}: ResearchOverviewProps) {
  const verticalPairs = [1, 2, 3, 4].map((idx) => ({
    pairIndex: idx,
    lower: landmarks.find((l) => l.pairIndex === idx && l.tier === 'lower')!,
    upper: landmarks.find((l) => l.pairIndex === idx && l.tier === 'upper')!,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Monocular Vision 3D
          </a>

          <nav
            aria-label="Research sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a href="#interactive-scene" className="hover:text-slate-900 whitespace-nowrap">
              3D Scene
            </a>
            <a href="#landmarks" className="hover:text-slate-900 whitespace-nowrap">
              Landmarks
            </a>
            <a href="#geometry" className="hover:text-slate-900 whitespace-nowrap">
              Ray-Angle Math
            </a>
            <a href="#scope" className="hover:text-slate-900 whitespace-nowrap">
              Method Notes
            </a>
          </nav>

          <button
            type="button"
            onClick={onLaunchFullscreenViewer}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            Launch Fullscreen 3D Viewer
          </button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-6 py-12 space-y-16">
        {/* Hero */}
        <section className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Nearshore Computer Vision</span>
            <span aria-hidden="true">·</span>
            <span>3D Projective Geometry</span>
            <span aria-hidden="true">·</span>
            <span>Interactive WebGL Reconstruction</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
            style={{ textWrap: 'balance' }}
          >
            {RESEARCH_OVERVIEW_CONTENT.title}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {RESEARCH_OVERVIEW_CONTENT.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onLaunchFullscreenViewer}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
              Open Interactive 3D Viewer
            </button>
            <a
              href={RESEARCH_OVERVIEW_CONTENT.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Project Page
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={RESEARCH_OVERVIEW_CONTENT.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              GitHub Source
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* Embedded Interactive 3D Scene Stage */}
        <section id="interactive-scene" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Interactive 3D Nearshore Positioning Scene
              </h2>
              <p className="text-sm text-slate-600">
                Drag to orbit, scroll to zoom, or click any landmark target to inspect world
                coordinates directly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
                <button
                  type="button"
                  onClick={() => onModeChange('realistic')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mode === 'realistic'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Realistic
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('scientific')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mode === 'scientific'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Scientific
                </button>
              </div>
              <button
                type="button"
                onClick={onLaunchFullscreenViewer}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                Fullscreen
              </button>
            </div>
          </div>

          <div className="h-[520px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <VisionSceneCanvas
              mode={mode}
              layers={layers}
              structureParams={structureParams}
              landmarks={landmarks}
              virtualCamera={virtualCamera}
              intrinsics={intrinsics}
              selectedObject={selectedObject}
              pairAId={pairAId}
              pairBId={pairBId}
              rayAngleMode={rayAngleMode}
              viewPreset="default"
              viewPresetTrigger={0}
              isPlaying={false}
              embedded
              onSelectObject={onSelectObject}
            />
          </div>
        </section>

        {/* Landmark Reference Table */}
        <section id="landmarks" className="space-y-4">
          <div className="max-w-3xl space-y-1.5">
            <h2 className="text-xl font-semibold text-slate-900">
              8-Landmark Vertical Pair Specification
            </h2>
            <p className="text-sm text-slate-600">
              World coordinate system uses right-handed Z-up meters (converted rigidly to Three.js
              Y-up via (x, z, −y)). Lower and upper tier elevations are fixed at z = 4.0 m and z =
              8.0 m; horizontal X/Y spans are editable schematic approximations.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Vertical Group</th>
                  <th className="px-4 py-3">Lower Tier (z = 4.0 m)</th>
                  <th className="px-4 py-3">Upper Tier (z = 8.0 m)</th>
                  <th className="px-4 py-3">Approx. (X, Y) m</th>
                  <th className="px-4 py-3">Semantic Classes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-num text-xs text-slate-700">
                {verticalPairs.map((pair) => (
                  <tr key={pair.pairIndex} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-sans font-medium text-slate-900">
                      Group {pair.pairIndex} · {pair.lower.pairLabel}
                    </td>
                    <td className="px-4 py-3">ID {pair.lower.id}</td>
                    <td className="px-4 py-3">ID {pair.upper.id}</td>
                    <td className="px-4 py-3">
                      ({pair.lower.worldPos.x.toFixed(2)}, {pair.lower.worldPos.y.toFixed(2)})
                    </td>
                    <td className="px-4 py-3">
                      Class {pair.lower.semanticClass} / Class {pair.upper.semanticClass}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{SEMANTIC_BACKGROUND_NOTE.label}:</span>{' '}
            {SEMANTIC_BACKGROUND_NOTE.description}
          </p>
        </section>

        {/* Ray-Angle Geometry & Pipeline */}
        <section id="geometry" className="space-y-6">
          <div className="max-w-3xl space-y-1.5">
            <h2 className="text-xl font-semibold text-slate-900">
              Ray-Angle Invariance Formulation
            </h2>
            <p className="text-sm text-slate-600">
              For any pair of observed structural corners (i, j), the angle between unit
              back-projected camera rays equals the angle between world sightlines originating from
              optical center C, eliminating camera orientation R from the position constraints:
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 font-mono-num text-sm text-slate-800 overflow-x-auto">
            cos(θ_ij) = d_i · d_j = [(P_i − C) · (P_j − C)] / (‖P_i − C‖ · ‖P_j − C‖)
            <span className="block mt-2 text-xs text-slate-500">
              where d_i = normalize(K⁻¹ [u_i, v_i, 1]ᵀ) is invariant to arbitrary camera rotations
              R ∈ SO(3).
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {RESEARCH_OVERVIEW_CONTENT.pipelineSteps.map((step) => (
              <div
                key={step.index}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-2"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {step.index}. {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodological Transparency */}
        <section id="scope" className="border-t border-slate-200 pt-8 space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Visualization Scope & Coordinate Disclosure
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-5">
            {RESEARCH_OVERVIEW_CONTENT.honestyDisclaimers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
