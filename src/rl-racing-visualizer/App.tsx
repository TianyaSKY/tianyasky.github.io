/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ImageDown, Moon, Sun } from 'lucide-react';
import {
  SCENARIO_PRESETS,
  VehiclePoseParams,
  buildObstaclesOnTrack,
  computeObservationSnapshot,
  generateCircuitTrack,
} from './sim/rlRacingMath';
import { LayerVisibility, ProjectedSceneAnchors } from './render/calloutLayout';
import { RenderedDiagramResult } from './render/exportDiagramCanvas';
import {
  RacingSceneCanvas,
  RacingSceneHandle,
} from './components/RacingSceneCanvas';
import { DiagramCalloutLayer } from './components/DiagramCalloutLayer';
import {
  CameraPresetId,
  StudioControlDock,
} from './components/StudioControlDock';
import { RenderedDiagramModal } from './components/RenderedDiagramModal';

const DEFAULT_LAYERS: LayerVisibility = {
  rays: true,
  rayBadges: true,
  speedArrow: true,
  centerline: true,
  headingAndPos: true,
  aabbBoxes: true,
  callouts: true,
};

export default function App() {
  // Deterministic Catmull-Rom closed circuit generated once
  const track = useMemo(() => generateCircuitTrack(16), []);

  const [scenarioId, setScenarioId] = useState<string>(SCENARIO_PRESETS[0].id);
  const [pose, setPose] = useState<VehiclePoseParams>({
    ...SCENARIO_PRESETS[0].pose,
  });
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('hero');
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const [anchors, setAnchors] = useState<ProjectedSceneAnchors | null>(null);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });
  const [renderedFigure, setRenderedFigure] = useState<RenderedDiagramResult | null>(null);

  const sceneRef = useRef<RacingSceneHandle | null>(null);

  const activeScenario = useMemo(
    () => SCENARIO_PRESETS.find((s) => s.id === scenarioId) ?? SCENARIO_PRESETS[0],
    [scenarioId],
  );

  const obstacles = useMemo(
    () =>
      buildObstaclesOnTrack(
        track,
        activeScenario.pose.trackSampleIndex,
        activeScenario.obstacles,
      ),
    [track, activeScenario],
  );

  const snapshot = useMemo(
    () => computeObservationSnapshot(track, pose, obstacles),
    [track, pose, obstacles],
  );

  const handleSelectScenario = useCallback((id: string) => {
    const preset = SCENARIO_PRESETS.find((s) => s.id === id);
    if (!preset) return;
    setScenarioId(id);
    setPose({ ...preset.pose });
    // Re-frame camera smoothly around the new car location
    window.setTimeout(() => {
      sceneRef.current?.applyCameraPreset(cameraPreset);
    }, 0);
  }, [cameraPreset]);

  const handleChangePose = useCallback((patch: Partial<VehiclePoseParams>) => {
    setPose((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleToggleLayer = useCallback((key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleRenderDiagram = useCallback(() => {
    const result = sceneRef.current?.renderHighResDiagram(activeScenario.name);
    if (result) {
      setRenderedFigure(result);
    }
  }, [activeScenario]);

  // Keyboard shortcuts: H to collapse dock, 1–4 for camera presets
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (renderedFigure || sceneUnavailable || e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      } else if (e.key === '1') {
        setCameraPreset('hero');
      } else if (e.key === '2') {
        setCameraPreset('top-radar');
      } else if (e.key === '3') {
        setCameraPreset('wheel-speed');
      } else if (e.key === '4') {
        setCameraPreset('centerline');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [renderedFigure, sceneUnavailable]);

  if (sceneUnavailable) {
    return (
      <main className="grid min-h-dvh place-items-center bg-slate-100 p-5 text-slate-900">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-semibold">Unable to start the RL Racing 3D visualizer</h1>
          <p className="my-3 text-sm text-slate-600">
            WebGL 2 could not start. Enable hardware acceleration and try again, or return to the project page to watch the video.
          </p>
          <a href="/projects/rl-racing/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline">
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to project
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative w-full h-dvh overflow-hidden ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
      data-state={renderedFigure ? 'preview-modal' : 'interactive-3d'}
      data-camera-preset={cameraPreset}
      data-scenario={scenarioId}
    >
      {/* Isolated full-bleed Three.js WebGL viewport */}
      <RacingSceneCanvas
        ref={sceneRef}
        track={track}
        snapshot={snapshot}
        obstacles={obstacles}
        layers={layers}
        cameraPreset={cameraPreset}
        darkMode={darkMode}
        isAnimating={isAnimating}
        onAnchorsUpdate={setAnchors}
        onViewportResize={setViewportSize}
        onUnavailable={() => setSceneUnavailable(true)}
      />

      {/* Live 3D-anchored vector arrows & technical callout labels */}
      <DiagramCalloutLayer
        anchors={anchors}
        snapshot={snapshot}
        layers={layers}
        darkMode={darkMode}
        viewportSize={viewportSize}
      />

      {/* Minimal Top Bar: Brand Title + Quiet Metadata on Left, Primary Render CTA on Right */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-3 pt-3 sm:gap-4 sm:px-5 sm:pt-4">
        <div
          className={`pointer-events-auto rounded-xl px-4 py-2.5 border ${
            darkMode
              ? 'bg-[#0e131e]/94 border-white/10 text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
              : 'bg-white/95 border-slate-900/10 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.08)]'
          }`}
        >
          <a href="/projects/rl-racing/" className="mb-1 inline-flex min-h-6 items-center gap-1.5 text-xs font-medium hover:underline">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to project
          </a>
          <h1 className="text-sm font-semibold tracking-tight leading-tight">
            RL Racing 3D Visualizer
          </h1>
          <div
            className={`hidden sm:flex items-center gap-1.5 text-[11px] font-mono-tabular mt-0.5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span>16-D observation</span>
            <span aria-hidden="true">·</span>
            <span>9-ray LiDAR</span>
            <span aria-hidden="true">·</span>
            <span>Discrete(7) PPO</span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              darkMode
                ? 'bg-[#0e131e]/94 border-white/10 text-slate-200 hover:bg-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                : 'bg-white/95 border-slate-900/10 text-slate-700 hover:bg-slate-50 shadow-[0_6px_20px_rgba(15,23,42,0.08)]'
            }`}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={handleRenderDiagram}
            aria-label="Render diagram"
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap sm:px-4 ${
              darkMode
                ? 'bg-slate-100 text-slate-950 hover:bg-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_6px_20px_rgba(15,23,42,0.18)]'
            }`}
          >
            <ImageDown className="w-4 h-4" />
            <span className="hidden sm:inline">Render diagram</span>
          </button>
        </div>
      </header>

      {/* Single Unified Collapsible Bottom Control Dock (zero side-panel clutter) */}
      <StudioControlDock
        collapsed={dockCollapsed}
        onToggleCollapse={() => setDockCollapsed((c) => !c)}
        darkMode={darkMode}
        cameraPreset={cameraPreset}
        onSelectCamera={setCameraPreset}
        scenarioId={scenarioId}
        onSelectScenario={handleSelectScenario}
        pose={pose}
        onChangePose={handleChangePose}
        layers={layers}
        onToggleLayer={handleToggleLayer}
        isAnimating={isAnimating}
        onToggleAnimating={() => setIsAnimating((a) => !a)}
        snapshot={snapshot}
      />

      {/* Rendered High-Resolution 2K PNG Diagram Preview & Download Modal */}
      <RenderedDiagramModal
        result={renderedFigure}
        darkMode={darkMode}
        onClose={() => setRenderedFigure(null)}
      />
    </main>
  );
}
