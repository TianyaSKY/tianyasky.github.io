import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type {
  CameraIntrinsics,
  CameraViewPreset,
  LandmarkSpec,
  LayerVisibility,
  StructureParams,
  ViewMode,
  VirtualCameraState,
} from '../data/visionPositioningConfig';
import { computeCameraBasis, worldToThree } from '../geometry/visionMath';
import { createNearshoreEnvironment } from '../scene/nearshoreEnvironment';
import { createOffshoreStructure } from '../scene/offshoreStructure';
import { createProceduralTextures } from '../scene/proceduralTextures';
import { createVirtualCameraRig } from '../scene/virtualCameraRig';

export type SelectedSceneObject =
  | { type: 'landmark'; id: number }
  | { type: 'camera' }
  | null;

export interface VisionSceneCanvasProps {
  mode: ViewMode;
  layers: LayerVisibility;
  structureParams: StructureParams;
  landmarks: LandmarkSpec[];
  virtualCamera: VirtualCameraState;
  intrinsics: CameraIntrinsics;
  selectedObject: SelectedSceneObject;
  pairAId: number;
  pairBId: number;
  rayAngleMode: boolean;
  viewPreset: CameraViewPreset;
  viewPresetTrigger: number;
  isPlaying: boolean;
  embedded?: boolean;
  onSelectObject: (sel: SelectedSceneObject, shiftKey?: boolean) => void;
}

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function checkWebGLSupport(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

interface PresetPose {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

function computePresetPose(
  preset: CameraViewPreset,
  virtualCamera: VirtualCameraState,
  intrinsics: CameraIntrinsics,
): PresetPose {
  switch (preset) {
    case 'top':
      return {
        pos: new THREE.Vector3(0.1, 36.0, 9.5),
        target: new THREE.Vector3(0, 3.0, 6.5),
        fov: 44,
      };
    case 'front':
      return {
        pos: new THREE.Vector3(0, 6.2, 26.5),
        target: new THREE.Vector3(0, 5.2, 0),
        fov: 44,
      };
    case 'side':
      return {
        pos: new THREE.Vector3(28.0, 6.4, 7.5),
        target: new THREE.Vector3(0, 5.0, 5.5),
        fov: 44,
      };
    case 'isometric':
      return {
        pos: new THREE.Vector3(24.5, 19.5, 24.5),
        target: new THREE.Vector3(1.0, 4.2, 3.0),
        fov: 40,
      };
    case 'focus-structure':
      return {
        pos: new THREE.Vector3(11.5, 9.2, 13.8),
        target: new THREE.Vector3(0, 5.6, 0),
        fov: 42,
      };
    case 'from-camera': {
      const basis = computeCameraBasis(virtualCamera);
      const posT = worldToThree(basis.position);
      const fwdT = worldToThree(basis.forward);
      return {
        pos: new THREE.Vector3(posT.x, posT.y, posT.z),
        target: new THREE.Vector3(
          posT.x + fwdT.x * 16,
          posT.y + fwdT.y * 16,
          posT.z + fwdT.z * 16,
        ),
        fov: intrinsics.fovDeg,
      };
    }
    case 'default':
    default:
      return {
        pos: new THREE.Vector3(24.5, 14.8, 32.5),
        target: new THREE.Vector3(3.2, 4.2, 6.8),
        fov: 44,
      };
  }
}

export function VisionSceneCanvas(props: VisionSceneCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglStatus, setWebglStatus] = useState<'loading' | 'ready' | 'unsupported' | 'lost'>(
    'loading',
  );

  // Store latest props in ref so WebGL renderer mounts ONCE and never tears down on UI updates
  const propsRef = useRef(props);
  propsRef.current = props;

  // Imperative handles exposed to sync effects
  const sceneControlRef = useRef<{
    syncAll: () => void;
    rebuildStructure: () => void;
    triggerPreset: (preset: CameraViewPreset) => void;
    requestRender: () => void;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!checkWebGLSupport()) {
      setWebglStatus('unsupported');
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Scene & Studio PBR Environment Reflections (same on every device)
    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 3. Viewer Camera + OrbitControls
    const initialPose = computePresetPose(
      propsRef.current.viewPreset,
      propsRef.current.virtualCamera,
      propsRef.current.intrinsics,
    );
    const viewerCamera = new THREE.PerspectiveCamera(initialPose.fov, width / height, 0.15, 500);
    viewerCamera.position.copy(initialPose.pos);

    const controls = new OrbitControls(viewerCamera, renderer.domElement);
    controls.target.copy(initialPose.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 4.0;
    controls.maxDistance = 88.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.update();

    // 4. Warm/Cool 3-Point Coastal Lighting Rig (single shadow caster)
    const sunKey = new THREE.DirectionalLight(0xfff4e0, 2.25);
    sunKey.position.set(28, 34, 24);
    sunKey.castShadow = !isSoftwareGl;
    sunKey.shadow.mapSize.set(1024, 1024);
    sunKey.shadow.camera.near = 2;
    sunKey.shadow.camera.far = 96;
    const d = 24;
    sunKey.shadow.camera.left = -d;
    sunKey.shadow.camera.right = d;
    sunKey.shadow.camera.top = d;
    sunKey.shadow.camera.bottom = -d;
    sunKey.shadow.bias = -0.0005;
    sunKey.shadow.normalBias = 0.025;
    scene.add(sunKey);

    const hemiFill = new THREE.HemisphereLight(0xb8dcf5, 0x26485e, 0.95);
    scene.add(hemiFill);

    const rimLight = new THREE.DirectionalLight(0xcbe5ff, 0.65);
    rimLight.position.set(-22, 14, -26);
    scene.add(rimLight);

    // 5. Procedural Textures, Nearshore Environment, Composite Structure & Virtual Camera Rig
    const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const textures = createProceduralTextures(maxAniso);
    const environment = createNearshoreEnvironment(textures);
    const structure = createOffshoreStructure(textures);
    const cameraRig = createVirtualCameraRig();

    scene.add(
      environment.skyMesh,
      environment.oceanGroup,
      environment.coastGroup,
      environment.axesGroup,
      environment.gridGroup,
      structure.group,
      cameraRig.group,
    );

    // Initial build
    structure.rebuild(propsRef.current.structureParams, propsRef.current.landmarks);

    function syncVisualState() {
      const p = propsRef.current;
      environment.applyModeAndLayers(
        p.mode,
        p.layers.oceanAndEnvironment,
        p.layers.coordinateAxes,
        p.layers.groundGrid,
        scene,
      );

      const selLandmarkId =
        p.selectedObject && p.selectedObject.type === 'landmark' ? p.selectedObject.id : null;

      structure.setDisplayState({
        mode: p.mode,
        showLabels: p.layers.landmarkLabels,
        showWireframe: p.layers.geometryWireframe,
        selectedLandmarkId: selLandmarkId,
        pairAId: p.pairAId,
        pairBId: p.pairBId,
        rayAngleMode: p.rayAngleMode,
      });

      cameraRig.updateCameraAndRays({
        cameraState: p.virtualCamera,
        landmarks: p.landmarks,
        intrinsics: p.intrinsics,
        pairAId: p.pairAId,
        pairBId: p.pairBId,
        rayAngleMode: p.rayAngleMode,
        showFrustum: p.layers.cameraFrustum,
        showRays: p.layers.cameraRays,
        showTrajectory: p.layers.cameraTrajectory,
        isSelected: p.selectedObject?.type === 'camera',
      });
    }

    syncVisualState();

    // Pre-warm shaders once on hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, viewerCamera);
    }

    // -------------------------------------------------------------------------
    // Smooth Camera Preset Transition State
    // -------------------------------------------------------------------------
    let activeTransition: PresetPose | null = null;
    let lockedToVirtualCam = propsRef.current.viewPreset === 'from-camera';

    controls.addEventListener('start', () => {
      activeTransition = null;
      lockedToVirtualCam = false;
    });

    // -------------------------------------------------------------------------
    // Raycasting for 3D Landmark & Virtual Camera Selection
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    function getPickIntersects(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, viewerCamera);
      const targets = [...structure.interactables, cameraRig.cameraInteractable];
      return raycaster.intersectObjects(targets, false);
    }

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 6) return; // User orbited, not clicked
      const hits = getPickIntersects(e.clientX, e.clientY);
      if (hits.length > 0) {
        const data = hits[0].object.userData;
        if (data.pickType === 'landmark' && typeof data.landmarkId === 'number') {
          propsRef.current.onSelectObject(
            { type: 'landmark', id: data.landmarkId },
            e.shiftKey,
          );
          return;
        }
        if (data.pickType === 'camera') {
          propsRef.current.onSelectObject({ type: 'camera' }, false);
          return;
        }
      }
    };

    let lastHoverCheck = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 75) return;
      lastHoverCheck = now;
      const hits = getPickIntersects(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // -------------------------------------------------------------------------
    // WebGL Context Lost / Restored Safety
    // -------------------------------------------------------------------------
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglStatus('lost');
    };
    const onContextRestored = () => {
      setWebglStatus('ready');
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // -------------------------------------------------------------------------
    // Render Loop (Coalesced On-Demand + GPU Wave Animation + SoftwareGL afterDraw)
    // -------------------------------------------------------------------------
    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTimestamp = performance.now();
    let elapsedSec = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 85);
      }
    }

    function needsContinuousRender(): boolean {
      if (document.visibilityState === 'hidden') return false;
      if (activeTransition) return true;
      if (propsRef.current.isPlaying) return true;
      // On GPU, animate subtle ocean waves continuously in Realistic Mode.
      // On software WebGL, render on demand (and during playback/transitions) to keep UI responsive.
      if (!isSoftwareGl && propsRef.current.mode === 'realistic' && propsRef.current.layers.oceanAndEnvironment) {
        return true;
      }
      return false;
    }

    function renderFrame(now: number) {
      if (disposed) return;
      renderDirty = false;
      const dt = Math.min(Math.max((now - lastTimestamp) / 1000, 0.001), 0.1);
      lastTimestamp = now;
      elapsedSec += dt;

      // Update ocean wave uniform
      environment.update(elapsedSec);

      // Keep viewer inside virtual camera when View from Camera is locked
      if (lockedToVirtualCam && !activeTransition) {
        const camPose = computePresetPose(
          'from-camera',
          propsRef.current.virtualCamera,
          propsRef.current.intrinsics,
        );
        viewerCamera.position.copy(camPose.pos);
        controls.target.copy(camPose.target);
        if (Math.abs(viewerCamera.fov - camPose.fov) > 0.05) {
          viewerCamera.fov = camPose.fov;
          viewerCamera.updateProjectionMatrix();
        }
      }

      // Exponentially damp camera preset transitions
      if (activeTransition) {
        if (isSoftwareGl) {
          // Settle cleanly in 1 step on software WebGL for snappy responsiveness
          viewerCamera.position.copy(activeTransition.pos);
          controls.target.copy(activeTransition.target);
          viewerCamera.fov = activeTransition.fov;
          viewerCamera.updateProjectionMatrix();
          activeTransition = null;
        } else {
          const lambda = 7.5;
          viewerCamera.position.x = THREE.MathUtils.damp(
            viewerCamera.position.x,
            activeTransition.pos.x,
            lambda,
            dt,
          );
          viewerCamera.position.y = THREE.MathUtils.damp(
            viewerCamera.position.y,
            activeTransition.pos.y,
            lambda,
            dt,
          );
          viewerCamera.position.z = THREE.MathUtils.damp(
            viewerCamera.position.z,
            activeTransition.pos.z,
            lambda,
            dt,
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            activeTransition.target.x,
            lambda,
            dt,
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            activeTransition.target.y,
            lambda,
            dt,
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            activeTransition.target.z,
            lambda,
            dt,
          );
          viewerCamera.fov = THREE.MathUtils.damp(
            viewerCamera.fov,
            activeTransition.fov,
            lambda,
            dt,
          );
          viewerCamera.updateProjectionMatrix();

          if (
            viewerCamera.position.distanceTo(activeTransition.pos) < 0.08 &&
            controls.target.distanceTo(activeTransition.target) < 0.08
          ) {
            viewerCamera.position.copy(activeTransition.pos);
            controls.target.copy(activeTransition.target);
            activeTransition = null;
          }
        }
      }

      controls.update();
      renderer.render(scene, viewerCamera);

      const finish = () => {
        renderBusy = false;
        if (disposed) return;
        if (renderDirty || needsContinuousRender()) {
          requestRender();
        }
      };

      if (isSoftwareGl) {
        afterDraw(finish);
      } else {
        finish();
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(renderFrame);
    }

    controls.addEventListener('change', requestRender);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTimestamp = performance.now();
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ResizeObserver for seamless desktop, tablet, and embedded viewport sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rw = Math.max(Math.floor(entry.contentRect.width), 200);
        const rh = Math.max(Math.floor(entry.contentRect.height), 180);
        viewerCamera.aspect = rw / rh;
        viewerCamera.updateProjectionMatrix();
        renderer.setSize(rw, rh, false);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    sceneControlRef.current = {
      syncAll: () => {
        syncVisualState();
        requestRender();
      },
      rebuildStructure: () => {
        structure.rebuild(propsRef.current.structureParams, propsRef.current.landmarks);
        syncVisualState();
        requestRender();
      },
      triggerPreset: (preset) => {
        lockedToVirtualCam = preset === 'from-camera';
        activeTransition = computePresetPose(
          preset,
          propsRef.current.virtualCamera,
          propsRef.current.intrinsics,
        );
        requestRender();
      },
      requestRender,
    };

    setWebglStatus('ready');
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      environment.dispose();
      structure.dispose();
      cameraRig.dispose();
      textures.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneControlRef.current = null;
    };
  }, []);

  // Rebuild 3D structure geometry only when editable structure parameters change
  useEffect(() => {
    sceneControlRef.current?.rebuildStructure();
  }, [props.structureParams]);

  // Synchronize mode, layers, virtual camera pose, rays, and selection without remounting WebGL
  useEffect(() => {
    sceneControlRef.current?.syncAll();
  }, [
    props.mode,
    props.layers,
    props.landmarks,
    props.virtualCamera,
    props.intrinsics,
    props.selectedObject,
    props.pairAId,
    props.pairBId,
    props.rayAngleMode,
    props.isPlaying,
  ]);

  // Trigger camera view preset transition
  useEffect(() => {
    if (props.viewPresetTrigger > 0) {
      sceneControlRef.current?.triggerPreset(props.viewPreset);
    }
  }, [props.viewPreset, props.viewPresetTrigger]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-slate-100"
      data-testid="vision-3d-viewport"
      data-mode={props.mode}
      data-ray-angle-mode={props.rayAngleMode ? 'on' : 'off'}
      data-webgl-status={webglStatus}
    >
      {/* Dedicated empty mount node for Three.js WebGLRenderer */}
      <div ref={mountRef} className="w-full h-full" />

      {webglStatus === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-700">
          <div className="text-center space-y-1.5">
            <p className="text-sm font-semibold text-slate-900">Initializing 3D WebGL Scene</p>
            <p className="text-xs text-slate-500">
              Loading nearshore geometry, coordinate frames, and camera optics
            </p>
          </div>
        </div>
      )}

      {webglStatus === 'unsupported' && (
        <div
          role="alert"
          className="absolute inset-0 flex items-center justify-center bg-slate-50 p-6 text-slate-800"
        >
          <div className="max-w-md border border-slate-200 bg-white p-6 rounded-xl shadow-sm space-y-2">
            <h2 className="text-base font-semibold text-slate-900">
              WebGL Rendering Unavailable
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your browser or graphics environment does not currently expose a WebGL context.
              Switch to the Research Overview tab to review the 8-landmark geometry specification
              and ray-angle formulation, or enable hardware acceleration in browser settings.
            </p>
          </div>
        </div>
      )}

      {webglStatus === 'lost' && (
        <div
          role="alert"
          className="absolute inset-0 flex items-center justify-center bg-slate-900/80 p-6 text-white"
        >
          <div className="max-w-sm bg-slate-900 border border-slate-700 p-5 rounded-xl text-center space-y-2">
            <p className="text-sm font-semibold">WebGL Context Interrupted</p>
            <p className="text-xs text-slate-300">
              Waiting for graphics context recovery. Reload the page if the scene does not resume.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
