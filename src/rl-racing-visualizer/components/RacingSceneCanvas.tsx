import React, { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ObservationSnapshot,
  ObstacleBox,
  TrackSample,
} from '../sim/rlRacingMath';
import {
  LayerVisibility,
  ProjectedSceneAnchors,
} from '../render/calloutLayout';
import {
  RenderedDiagramResult,
  compositePublicationDiagram,
} from '../render/exportDiagramCanvas';
import { createProceduralTextures } from '../three/proceduralTextures';
import { buildRaceCar } from '../three/buildRaceCar';
import { buildTrackEnvironment } from '../three/buildTrackEnvironment';
import { buildDataOverlays } from '../three/buildDataOverlays';
import { CameraPresetId } from './StudioControlDock';

export interface RacingSceneHandle {
  renderHighResDiagram: (scenarioTitle: string) => RenderedDiagramResult | null;
  applyCameraPreset: (preset: CameraPresetId) => void;
}

interface RacingSceneCanvasProps {
  track: TrackSample[];
  snapshot: ObservationSnapshot;
  obstacles: ObstacleBox[];
  layers: LayerVisibility;
  cameraPreset: CameraPresetId;
  darkMode: boolean;
  isAnimating: boolean;
  onAnchorsUpdate: (anchors: ProjectedSceneAnchors) => void;
  onViewportResize: (size: { width: number; height: number }) => void;
  onUnavailable: () => void;
}

function detectSoftwareGl(): boolean | null {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function sceneFieldOfView(aspect: number) {
  // Preserve the 42° vertical framing on desktop and at least 42° horizontally in portrait.
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(21)) / Math.min(aspect, 1)));
}

function computeCameraTargetAndPos(
  preset: CameraPresetId,
  snapshot: ObservationSnapshot,
): { pos: THREE.Vector3; target: THREE.Vector3 } {
  const yaw = (snapshot.carAngleDeg * Math.PI) / 180;
  const fwdX = Math.sin(yaw);
  const fwdZ = Math.cos(yaw);
  const rightX = -Math.cos(yaw);
  const rightZ = Math.sin(yaw);

  const cx = snapshot.carX;
  const cz = snapshot.carZ;

  if (preset === 'top-radar') {
    return {
      pos: new THREE.Vector3(cx + fwdX * 8.5 - rightX * 1.5, 42.0, cz + fwdZ * 8.5 - rightZ * 1.5),
      target: new THREE.Vector3(cx + fwdX * 8.0, 0.5, cz + fwdZ * 8.0),
    };
  }
  if (preset === 'wheel-speed') {
    // Low dramatic 3/4 view focused squarely on front-right tire & green speed vector arrow
    return {
      pos: new THREE.Vector3(
        cx + rightX * 6.8 + fwdX * 4.8,
        2.35,
        cz + rightZ * 6.8 + fwdZ * 4.8,
      ),
      target: new THREE.Vector3(
        cx + rightX * 0.9 + fwdX * 1.8,
        0.58,
        cz + rightZ * 0.9 + fwdZ * 1.8,
      ),
    };
  }
  if (preset === 'centerline') {
    // Rear elevated chase view looking along the track tangent to highlight centerline offset & off-road boundary
    return {
      pos: new THREE.Vector3(
        cx - fwdX * 14.5 + rightX * 5.0,
        9.2,
        cz - fwdZ * 14.5 + rightZ * 5.0,
      ),
      target: new THREE.Vector3(
        (cx + snapshot.closestPoint.x) * 0.5 + fwdX * 6.0,
        0.8,
        (cz + snapshot.closestPoint.z) * 0.5 + fwdZ * 6.0,
      ),
    };
  }

  // Default 'hero': Elevated front-right 3/4 publication perspective showing car, front-right tire speed arrow,
  // 9 LiDAR rays fanning forward into obstacles, centerline offset vector, and curved road.
  return {
    pos: new THREE.Vector3(
      cx + rightX * 13.5 - fwdX * 11.2,
      11.8,
      cz + rightZ * 13.5 - fwdZ * 11.2,
    ),
    target: new THREE.Vector3(
      cx + fwdX * 6.4 - rightX * 0.6,
      0.9,
      cz + fwdZ * 6.4 - rightZ * 0.6,
    ),
  };
}

export const RacingSceneCanvas = React.forwardRef<RacingSceneHandle, RacingSceneCanvasProps>(
  (
    {
      track,
      snapshot,
      obstacles,
      layers,
      cameraPreset,
      darkMode,
      isAnimating,
      onAnchorsUpdate,
      onViewportResize,
      onUnavailable,
    },
    ref,
  ) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    // Keep latest reactive props in refs so WebGLRenderer mounts ONCE and never tears down on state changes
    const stateRef = useRef({
      snapshot,
      obstacles,
      layers,
      darkMode,
      isAnimating,
      onAnchorsUpdate,
      onViewportResize,
    });
    stateRef.current = {
      snapshot,
      obstacles,
      layers,
      darkMode,
      isAnimating,
      onAnchorsUpdate,
      onViewportResize,
    };

    const sceneApiRef = useRef<{
      syncSceneState: () => void;
      setCameraPreset: (preset: CameraPresetId, instant?: boolean) => void;
      setTheme: (dark: boolean) => void;
      setAnimating: (anim: boolean) => void;
      captureFigure: (scenarioTitle: string) => RenderedDiagramResult | null;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      renderHighResDiagram: (scenarioTitle: string) =>
        sceneApiRef.current?.captureFigure(scenarioTitle) ?? null,
      applyCameraPreset: (preset: CameraPresetId) => {
        sceneApiRef.current?.setCameraPreset(preset, false);
      },
    }));

    // Mount Three.js once
    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const isSoftwareGl = detectSoftwareGl();
      if (isSoftwareGl === null) {
        onUnavailable();
        return;
      }
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      stateRef.current.onViewportResize({ width, height });

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        });
      } catch {
        onUnavailable();
        return;
      }
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.04;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.setAttribute('data-testid', 'threejs-canvas');
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      // Mandatory Studio RoomEnvironment reflections (on EVERY device including SoftwareGL)
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      pmremGenerator.dispose();

      // Balanced 3-point warm/cool outdoor studio lighting (1 shadow caster)
      const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x3b4f3a, 0.88);
      hemiLight.position.set(0, 60, 0);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.45);
      keyLight.castShadow = !isSoftwareGl;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 5;
      keyLight.shadow.camera.far = 140;
      const d = 38;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);
      scene.add(keyLight.target);

      const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.72);
      scene.add(rimLight);

      const aspect = width / height;
      const camera = new THREE.PerspectiveCamera(sceneFieldOfView(aspect), aspect, 0.25, 650);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.08;
      controls.maxPolarAngle = Math.PI * 0.485;
      controls.minDistance = 4.5;
      controls.maxDistance = 95;

      // Build procedural textures + composite models
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      let currentDark = stateRef.current.darkMode;
      let textures = createProceduralTextures(maxAniso, currentDark);
      let trackRig = buildTrackEnvironment(track, textures, currentDark);
      let overlaysRig = buildDataOverlays(currentDark);
      const carRig = buildRaceCar(textures.tireBump, textures.contactShadowMap);

      scene.add(trackRig.root);
      scene.add(carRig.root);
      scene.add(overlaysRig.root);

      const applyBackdropTheme = (dark: boolean) => {
        const bgHex = dark ? 0x0b1324 : 0xdbe7f4;
        scene.background = new THREE.Color(bgHex);
        scene.fog = new THREE.FogExp2(bgHex, dark ? 0.0052 : 0.0044);
        hemiLight.color.setHex(dark ? 0x60a5fa : 0xe0f2fe);
        hemiLight.groundColor.setHex(dark ? 0x111827 : 0x4b634b);
        hemiLight.intensity = dark ? 0.78 : 0.88;
        keyLight.intensity = dark ? 1.25 : 1.45;
      };
      applyBackdropTheme(currentDark);

      // Scratch objects (zero GC allocations inside render tick)
      const _tireWorld = new THREE.Vector3();
      const _lidarWorld = new THREE.Vector3();
      const _camGoalPos = new THREE.Vector3();
      const _camGoalTarget = new THREE.Vector3();
      let camTransitionActive = false;

      // Render scheduling (on-demand + paced software-WebGL loop)
      let frameId = 0;
      let renderBusy = false;
      let renderDirty = false;
      let continuousActive = stateRef.current.isAnimating;
      let lastTimeMs = performance.now();
      let lastAnchorPushMs = 0;
      let disposed = false;

      const afterDraw = (cb: () => void) => {
        if (disposed) return;
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      const updateCarAndOverlays = () => {
        const { snapshot: snap, obstacles: obs, layers: lyr } = stateRef.current;
        const yawRad = (snap.carAngleDeg * Math.PI) / 180;

        carRig.root.position.set(snap.carX, 0.04, snap.carZ);
        carRig.root.rotation.set(0, yawRad, 0);

        // Articulated front steering angle based on discrete action
        const steerRad = snap.action.steer * -0.34;
        carRig.frontLeftPivot.rotation.y = steerRad;
        carRig.frontRightPivot.rotation.y = steerRad;

        // Dynamic brake light illumination
        carRig.brakeLightMat.emissiveIntensity = snap.action.throttle < 0 ? 2.4 : 0.65;

        carRig.root.updateMatrixWorld(true);
        _tireWorld.copy(carRig.frontRightTireLocal).applyMatrix4(carRig.root.matrixWorld);
        _lidarWorld.copy(carRig.lidarOriginLocal).applyMatrix4(carRig.root.matrixWorld);

        // Keep shadow frustum centered around the car
        keyLight.position.set(snap.carX + 24, 34, snap.carZ + 18);
        keyLight.target.position.set(snap.carX, 0, snap.carZ);
        keyLight.target.updateMatrixWorld();
        rimLight.position.set(snap.carX - 20, 14, snap.carZ - 22);

        trackRig.updateObstacles(obs, lyr.aabbBoxes);
        overlaysRig.update(snap, obs, lyr, _tireWorld, _lidarWorld);
      };

      const pushProjectedAnchors = (force = false) => {
        const now = performance.now();
        if (!force && now - lastAnchorPushMs < 48) return;
        lastAnchorPushMs = now;
        const { snapshot: snap, obstacles: obs } = stateRef.current;
        const projected = overlaysRig.computeProjectedAnchors(
          camera,
          snap,
          obs,
          _tireWorld,
          _lidarWorld,
        );
        stateRef.current.onAnchorsUpdate(projected);
      };

      const drawOnce = (dt: number) => {
        if (camTransitionActive) {
          if (isSoftwareGl) {
            camera.position.copy(_camGoalPos);
            controls.target.copy(_camGoalTarget);
            camTransitionActive = false;
          } else {
            const alpha = 1 - Math.exp(-7.5 * dt);
            camera.position.lerp(_camGoalPos, alpha);
            controls.target.lerp(_camGoalTarget, alpha);
            if (
              camera.position.distanceToSquared(_camGoalPos) < 0.002 &&
              controls.target.distanceToSquared(_camGoalTarget) < 0.002
            ) {
              camera.position.copy(_camGoalPos);
              controls.target.copy(_camGoalTarget);
              camTransitionActive = false;
            }
          }
        }

        if (continuousActive) {
          const spinRate = stateRef.current.snapshot.speed * 11.5;
          for (const wheel of carRig.wheelMeshes) {
            wheel.rotation.x += spinRate * dt;
          }
        }

        controls.update();
        renderer.render(scene, camera);
        pushProjectedAnchors(!continuousActive && !camTransitionActive);
      };

      const requestRender = () => {
        if (disposed || continuousActive) return;
        if (renderBusy) {
          renderDirty = true;
          return;
        }
        renderBusy = true;
        frameId = requestAnimationFrame(() => {
          if (disposed) return;
          renderDirty = false;
          const now = performance.now();
          const dt = Math.min(0.05, Math.max(0.001, (now - lastTimeMs) / 1000));
          lastTimeMs = now;
          drawOnce(dt);
          const done = () => {
            renderBusy = false;
            if (camTransitionActive || renderDirty) {
              requestRender();
            }
          };
          if (isSoftwareGl) afterDraw(done);
          else done();
        });
      };

      const tickContinuous = () => {
        if (disposed || !continuousActive) return;
        const now = performance.now();
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTimeMs) / 1000));
        lastTimeMs = now;
        drawOnce(dt);
        if (isSoftwareGl) afterDraw(tickContinuous);
        else frameId = requestAnimationFrame(tickContinuous);
      };

      // Cancel scripted camera transition immediately when user orbits manually
      const onControlsStart = () => {
        camTransitionActive = false;
      };
      const onControlsChange = () => {
        requestRender();
      };
      controls.addEventListener('start', onControlsStart);
      controls.addEventListener('change', onControlsChange);

      // Initial placement & shader warm-up
      updateCarAndOverlays();
      const initialCam = computeCameraTargetAndPos(cameraPreset, stateRef.current.snapshot);
      camera.position.copy(initialCam.pos);
      controls.target.copy(initialCam.target);
      controls.update();

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }
      renderer.render(scene, camera);
      pushProjectedAnchors(true);
      if (continuousActive) {
        tickContinuous();
      }

      // Handle window resize
      const onResize = () => {
        if (!container || disposed) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.fov = sceneFieldOfView(camera.aspect);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.render(scene, camera);
        pushProjectedAnchors(true);
        stateRef.current.onViewportResize({ width: w, height: h });
      };
      window.addEventListener('resize', onResize);

      // Handle WebGL context loss gracefully
      const onContextLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      };
      const onContextRestored = () => {
        requestRender();
      };
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

      // Expose imperative bridge for prop updates & high-res PNG capture
      sceneApiRef.current = {
        syncSceneState: () => {
          updateCarAndOverlays();
          requestRender();
        },
        setCameraPreset: (preset: CameraPresetId, instant = false) => {
          const { pos, target } = computeCameraTargetAndPos(preset, stateRef.current.snapshot);
          _camGoalPos.copy(pos);
          _camGoalTarget.copy(target);
          if (instant || isSoftwareGl) {
            camera.position.copy(pos);
            controls.target.copy(target);
            controls.update();
            camTransitionActive = false;
          } else {
            camTransitionActive = true;
          }
          requestRender();
        },
        setTheme: (dark: boolean) => {
          if (dark === currentDark) return;
          currentDark = dark;
          applyBackdropTheme(dark);

          scene.remove(trackRig.root);
          scene.remove(overlaysRig.root);
          trackRig.dispose();
          overlaysRig.dispose();
          textures.dispose();

          textures = createProceduralTextures(maxAniso, dark);
          trackRig = buildTrackEnvironment(track, textures, dark);
          overlaysRig = buildDataOverlays(dark);
          scene.add(trackRig.root);
          scene.add(overlaysRig.root);

          updateCarAndOverlays();
          requestRender();
        },
        setAnimating: (anim: boolean) => {
          if (anim === continuousActive) return;
          continuousActive = anim;
          cancelAnimationFrame(frameId);
          clearTimeout(frameId);
          renderBusy = false;
          lastTimeMs = performance.now();
          if (continuousActive) {
            tickContinuous();
          } else {
            requestRender();
          }
        },
        captureFigure: (scenarioTitle: string) => {
          // Per Three.js skill: render immediately before reading canvas pixels in same handler
          updateCarAndOverlays();
          controls.update();
          renderer.render(scene, camera);
          const { snapshot: snap, obstacles: obs, layers: lyr, darkMode: dark } = stateRef.current;
          const freshAnchors = overlaysRig.computeProjectedAnchors(
            camera,
            snap,
            obs,
            _tireWorld,
            _lidarWorld,
          );
          return compositePublicationDiagram(
            renderer.domElement,
            freshAnchors,
            snap,
            lyr,
            dark,
            scenarioTitle,
          );
        },
      };

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('resize', onResize);
        controls.removeEventListener('start', onControlsStart);
        controls.removeEventListener('change', onControlsChange);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
        controls.dispose();
        carRig.dispose();
        trackRig.dispose();
        overlaysRig.dispose();
        textures.dispose();
        envTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        sceneApiRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync scene geometry/overlays on pose, obstacle, or layer changes
    useEffect(() => {
      sceneApiRef.current?.syncSceneState();
    }, [snapshot, obstacles, layers]);

    // Sync camera preset changes
    useEffect(() => {
      sceneApiRef.current?.setCameraPreset(cameraPreset, false);
    }, [cameraPreset]);

    // Sync theme changes
    useEffect(() => {
      sceneApiRef.current?.setTheme(darkMode);
    }, [darkMode]);

    // Sync animation playback toggle
    useEffect(() => {
      sceneApiRef.current?.setAnimating(isAnimating);
    }, [isAnimating]);

    return (
      <div
        ref={mountRef}
        className="fixed inset-0 overflow-hidden"
        aria-label="RL Racing 3D 可视化视口"
      />
    );
  },
);

RacingSceneCanvas.displayName = 'RacingSceneCanvas';
