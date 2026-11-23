import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ResearchOverview } from './components/ResearchOverview';
import { SceneInspector, type InspectorTab } from './components/SceneInspector';
import { TimelineDock } from './components/TimelineDock';
import { ViewerTopBar } from './components/ViewerTopBar';
import { VisionSceneCanvas, type SelectedSceneObject } from './components/VisionSceneCanvas';
import {
  buildLandmarksFromParams,
  DEFAULT_CAMERA_INTRINSICS,
  DEFAULT_LAYERS,
  DEFAULT_STRUCTURE_PARAMS,
  DEFAULT_VIRTUAL_CAMERA,
  type CameraViewPreset,
  type LayerVisibility,
  type StructureParams,
  type ViewMode,
  type VirtualCameraState,
} from './data/visionPositioningConfig';
import { sampleSimulationTrajectory } from './geometry/visionMath';

type ActiveRoute = 'viewer' | 'overview';

function readInitialRoute(): ActiveRoute {
  if (typeof window === 'undefined') return 'viewer';
  return new URLSearchParams(window.location.search).get('view') === 'overview'
    ? 'overview'
    : 'viewer';
}

export default function App() {
  const [route, setRoute] = useState<ActiveRoute>(readInitialRoute);
  const [mode, setMode] = useState<ViewMode>('realistic');
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [structureParams, setStructureParams] = useState<StructureParams>(
    DEFAULT_STRUCTURE_PARAMS,
  );
  const [virtualCamera, setVirtualCamera] = useState<VirtualCameraState>(DEFAULT_VIRTUAL_CAMERA);
  const [selectedObject, setSelectedObject] = useState<SelectedSceneObject>({
    type: 'landmark',
    id: 0,
  });
  const [pairAId, setPairAId] = useState<number>(0);
  const [pairBId, setPairBId] = useState<number>(5);
  const [rayAngleMode, setRayAngleMode] = useState<boolean>(false);

  const [viewPreset, setViewPreset] = useState<CameraViewPreset>('default');
  const [viewPresetTrigger, setViewPresetTrigger] = useState<number>(0);

  // Start Scene Inspector open on wide desktop, collapsed on narrower viewports
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1180 : true,
  );
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('inspect');
  const [hudHidden, setHudHidden] = useState<boolean>(false);

  // Simulation Demo camera trajectory playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trajectoryProgress, setTrajectoryProgress] = useState<number>(0.65);
  const progressRef = useRef<number>(trajectoryProgress);
  progressRef.current = trajectoryProgress;

  // Auto-collapse inspector when resizing to narrow mobile viewport
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) {
        setInspectorOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const landmarks = useMemo(
    () => buildLandmarksFromParams(structureParams),
    [structureParams],
  );

  const navigateTo = useCallback((target: ActiveRoute) => {
    setRoute(target);
    const url = new URL(window.location.href);
    url.hash = '';
    if (target === 'overview') {
      url.searchParams.set('view', 'overview');
    } else {
      url.searchParams.delete('view');
    }
    window.history.replaceState(null, '', url);
  }, []);

  // Keyboard shortcut: 'H' toggles HUD visibility for uncluttered inspection
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setHudHidden((prev) => !prev);
      } else if (e.key === ' ') {
        if (route === 'viewer') {
          e.preventDefault();
          setIsPlaying((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [route]);

  // Smooth Simulation Demo trajectory playback (throttled to ~20Hz React updates to keep 60fps WebGL clean)
  useEffect(() => {
    if (!isPlaying || route !== 'viewer') return;

    let rafId = 0;
    let lastTime = performance.now();
    let lastUiCommit = lastTime;
    const durationSec = 14.0; // full coastal arc sweep in 14 seconds

    const step = (now: number) => {
      if (document.visibilityState === 'hidden') {
        lastTime = now;
        rafId = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const next = (progressRef.current + dt / durationSec) % 1.0;
      progressRef.current = next;

      if (now - lastUiCommit >= 48) {
        lastUiCommit = now;
        setTrajectoryProgress(next);
        setVirtualCamera(sampleSimulationTrajectory(next));
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, route]);

  const handleScrub = useCallback((nextProgress: number) => {
    setIsPlaying(false);
    setTrajectoryProgress(nextProgress);
    setVirtualCamera(sampleSimulationTrajectory(nextProgress));
  }, []);

  const handleResetTrajectory = useCallback(() => {
    setIsPlaying(false);
    setTrajectoryProgress(0);
    setVirtualCamera(sampleSimulationTrajectory(0));
  }, []);

  const handleSelectPreset = useCallback((preset: CameraViewPreset) => {
    setViewPreset(preset);
    setViewPresetTrigger((n) => n + 1);
  }, []);

  const handleModeChange = useCallback((nextMode: ViewMode) => {
    setMode(nextMode);
    if (nextMode === 'scientific') {
      setLayers((prev) => ({
        ...prev,
        coordinateAxes: true,
        groundGrid: true,
        geometryWireframe: true,
      }));
    } else {
      setLayers((prev) => ({
        ...prev,
        oceanAndEnvironment: true,
        geometryWireframe: false,
        groundGrid: false,
      }));
    }
  }, []);

  const handleSelectObject = useCallback(
    (sel: SelectedSceneObject, shiftKey = false) => {
      if (shiftKey && sel?.type === 'landmark') {
        if (sel.id !== pairAId) {
          setPairBId(sel.id);
          setRayAngleMode(true);
          setInspectorTab('ray-angle');
          setInspectorOpen(true);
        }
        return;
      }
      setSelectedObject(sel);
      if (sel) {
        setInspectorOpen(true);
        if (inspectorTab === 'layers') {
          setInspectorTab('inspect');
        }
      }
    },
    [pairAId, inspectorTab],
  );

  const handleToggleRayAngleMode = useCallback(() => {
    setRayAngleMode((prev) => {
      const next = !prev;
      if (next) {
        setInspectorOpen(true);
        setInspectorTab('ray-angle');
        setLayers((l) => ({ ...l, cameraRays: true, cameraFrustum: true }));
      }
      return next;
    });
  }, []);

  const handleUpdateVirtualCamera = useCallback((patch: Partial<VirtualCameraState>) => {
    setIsPlaying(false);
    setVirtualCamera((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleUpdateVirtualCameraPos = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    setIsPlaying(false);
    setVirtualCamera((prev) => ({
      ...prev,
      position: { ...prev.position, [axis]: value },
    }));
  }, []);

  const handleResetCameraPose = useCallback(() => {
    setIsPlaying(false);
    setVirtualCamera(DEFAULT_VIRTUAL_CAMERA);
  }, []);

  const handleToggleLayer = useCallback((key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleUpdateStructureParams = useCallback((patch: Partial<StructureParams>) => {
    setStructureParams((prev) => ({ ...prev, ...patch }));
  }, []);

  if (route === 'overview') {
    return (
      <ResearchOverview
        mode={mode}
        onModeChange={handleModeChange}
        layers={layers}
        structureParams={structureParams}
        landmarks={landmarks}
        virtualCamera={virtualCamera}
        intrinsics={DEFAULT_CAMERA_INTRINSICS}
        selectedObject={selectedObject}
        pairAId={pairAId}
        pairBId={pairBId}
        rayAngleMode={rayAngleMode}
        onSelectObject={handleSelectObject}
        onLaunchFullscreenViewer={() => navigateTo('viewer')}
      />
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-100 select-none">
      {/* Full-Bleed Real-Time WebGL 3D Canvas */}
      <VisionSceneCanvas
        mode={mode}
        layers={layers}
        structureParams={structureParams}
        landmarks={landmarks}
        virtualCamera={virtualCamera}
        intrinsics={DEFAULT_CAMERA_INTRINSICS}
        selectedObject={selectedObject}
        pairAId={pairAId}
        pairBId={pairBId}
        rayAngleMode={rayAngleMode}
        viewPreset={viewPreset}
        viewPresetTrigger={viewPresetTrigger}
        isPlaying={isPlaying}
        onSelectObject={handleSelectObject}
      />

      {/* Lightweight Floating HUD Layer */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <ViewerTopBar
          mode={mode}
          onModeChange={handleModeChange}
          rayAngleMode={rayAngleMode}
          onToggleRayAngleMode={handleToggleRayAngleMode}
          viewPreset={viewPreset}
          onSelectPreset={handleSelectPreset}
          inspectorOpen={inspectorOpen}
          onToggleInspector={() => setInspectorOpen((o) => !o)}
          onOpenOverview={() => navigateTo('overview')}
          hudHidden={hudHidden}
        />

        {!hudHidden && (
          <SceneInspector
            open={inspectorOpen}
            activeTab={inspectorTab}
            onTabChange={setInspectorTab}
            onClose={() => setInspectorOpen(false)}
            landmarks={landmarks}
            virtualCamera={virtualCamera}
            intrinsics={DEFAULT_CAMERA_INTRINSICS}
            selectedObject={selectedObject}
            onSelectObject={(sel) => handleSelectObject(sel, false)}
            pairAId={pairAId}
            pairBId={pairBId}
            onPairAChange={setPairAId}
            onPairBChange={setPairBId}
            rayAngleMode={rayAngleMode}
            onToggleRayAngleMode={setRayAngleMode}
            onUpdateVirtualCamera={handleUpdateVirtualCamera}
            onUpdateVirtualCameraPos={handleUpdateVirtualCameraPos}
            layers={layers}
            onToggleLayer={handleToggleLayer}
            structureParams={structureParams}
            onUpdateStructureParams={handleUpdateStructureParams}
            onResetCameraPose={handleResetCameraPose}
          />
        )}

        <TimelineDock
          progress={trajectoryProgress}
          isPlaying={isPlaying}
          cameraPosition={virtualCamera.position}
          hudHidden={hudHidden}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onReset={handleResetTrajectory}
          onScrub={handleScrub}
          onToggleHudHidden={() => setHudHidden((h) => !h)}
        />
      </div>
    </main>
  );
}
