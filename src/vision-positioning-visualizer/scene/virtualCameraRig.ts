import * as THREE from 'three';
import type {
  CameraIntrinsics,
  LandmarkSpec,
  VirtualCameraState,
} from '../data/visionPositioningConfig';
import {
  analyzeRayAnglePair,
  computeCameraBasis,
  generateTrajectoryPoints,
  projectLandmarkToImage,
  worldToThree,
} from '../geometry/visionMath';
import { createBadgeSpriteTexture } from './proceduralTextures';

export interface VirtualCameraRigHandle {
  group: THREE.Group;
  cameraInteractable: THREE.Object3D;
  updateCameraAndRays: (opts: {
    cameraState: VirtualCameraState;
    landmarks: LandmarkSpec[];
    intrinsics: CameraIntrinsics;
    pairAId: number;
    pairBId: number;
    rayAngleMode: boolean;
    showFrustum: boolean;
    showRays: boolean;
    showTrajectory: boolean;
    isSelected: boolean;
  }) => void;
  dispose: () => void;
}

const FRUSTUM_PLANE_DIST = 2.6; // Distance of virtual image sensor plane from optical center C (m)

/**
 * Builds the composite 3D Virtual Monocular Camera object (optical center C, machined body,
 * lathe lens barrel, gimbal mount, local orientation triad, dynamic frustum + image sensor plane
 * with live projected landmark pixels), observation rays, ray-angle invariance wedge + arc,
 * and the Simulation Demo trajectory spline.
 */
export function createVirtualCameraRig(): VirtualCameraRigHandle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'VirtualCameraRig';

  const cameraObjectGroup = new THREE.Group();
  cameraObjectGroup.name = 'VirtualCameraModel';

  const frustumGroup = new THREE.Group();
  frustumGroup.name = 'CameraFrustumGroup';

  const raysGroup = new THREE.Group();
  raysGroup.name = 'CameraRaysGroup';

  const angleWedgeGroup = new THREE.Group();
  angleWedgeGroup.name = 'RayAngleWedgeGroup';

  const trajectoryGroup = new THREE.Group();
  trajectoryGroup.name = 'CameraTrajectoryGroup';

  rootGroup.add(cameraObjectGroup, raysGroup, angleWedgeGroup, trajectoryGroup);
  cameraObjectGroup.add(frustumGroup);

  const disposables: Array<{ dispose: () => void }> = [];

  // -------------------------------------------------------------------------
  // 1. Composite 7-Part Procedural Monocular Camera Assembly
  //    Right-handed local convention inside cameraObjectGroup (det = +1):
  //      +X = camera right (+Xc)
  //      +Y = camera up (-Yc)
  //      -Z = camera optical axis forward (+Zc, standard Three.js camera convention)
  // -------------------------------------------------------------------------
  const bodyShape = new THREE.Shape();
  const bw = 0.42;
  const bh = 0.28;
  bodyShape.moveTo(-bw, -bh);
  bodyShape.lineTo(bw, -bh);
  bodyShape.lineTo(bw, bh);
  bodyShape.lineTo(-bw, bh);
  bodyShape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.56,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 2,
  });
  // Body extends behind optical center C along +Z (0.02 .. +0.58)
  bodyGeo.translate(0, 0, 0.02);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.34,
    metalness: 0.78,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  cameraObjectGroup.add(bodyMesh);
  disposables.push(bodyGeo, bodyMat);

  // Multi-step telephoto lens barrel using LatheGeometry along -Z (forward)
  const lathePts = [
    new THREE.Vector2(0.18, 0.0),
    new THREE.Vector2(0.24, 0.02),
    new THREE.Vector2(0.24, 0.22),
    new THREE.Vector2(0.27, 0.25),
    new THREE.Vector2(0.27, 0.42),
    new THREE.Vector2(0.29, 0.44),
    new THREE.Vector2(0.29, 0.56),
    new THREE.Vector2(0.22, 0.56),
    new THREE.Vector2(0.21, 0.48),
  ];
  const lensGeo = new THREE.LatheGeometry(lathePts, 24);
  lensGeo.rotateX(-Math.PI / 2);
  const lensMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.26,
    metalness: 0.86,
  });
  const lensMesh = new THREE.Mesh(lensGeo, lensMat);
  lensMesh.castShadow = true;
  cameraObjectGroup.add(lensMesh);
  disposables.push(lensGeo, lensMat);

  // Metallic focus accent ring
  const trimRingGeo = new THREE.TorusGeometry(0.275, 0.018, 8, 28);
  const trimRingMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.28,
    metalness: 0.65,
  });
  const trimRing = new THREE.Mesh(trimRingGeo, trimRingMat);
  trimRing.position.z = -0.34;
  cameraObjectGroup.add(trimRing);
  disposables.push(trimRingGeo, trimRingMat);

  // Optical glass front element facing -Z
  const glassGeo = new THREE.CircleGeometry(0.21, 20);
  glassGeo.rotateY(Math.PI);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#0c4a6e',
    roughness: 0.08,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.z = -0.52;
  cameraObjectGroup.add(glassMesh);
  disposables.push(glassGeo, glassMat);

  // Top handle / sensor mount housing
  const mountGeo = new THREE.BoxGeometry(0.32, 0.14, 0.36);
  const mountMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.46,
    metalness: 0.62,
  });
  const mountMesh = new THREE.Mesh(mountGeo, mountMat);
  mountMesh.position.set(0, 0.36, 0.3);
  cameraObjectGroup.add(mountMesh);
  disposables.push(mountGeo, mountMat);

  // Gimbal yoke + base post
  const yokeGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.45, 10);
  const yokeMesh = new THREE.Mesh(yokeGeo, mountMat);
  yokeMesh.position.set(0, -0.52, 0.28);
  cameraObjectGroup.add(yokeMesh);
  disposables.push(yokeGeo);

  // Optical Center C marker at exact pinhole origin (0, 0, 0)
  const centerGeo = new THREE.SphereGeometry(0.11, 14, 12);
  const centerMat = new THREE.MeshBasicMaterial({ color: '#0284c7' });
  const centerSphere = new THREE.Mesh(centerGeo, centerMat);
  cameraObjectGroup.add(centerSphere);
  disposables.push(centerGeo, centerMat);

  // Camera selection highlight halo
  const camHaloGeo = new THREE.TorusGeometry(0.76, 0.035, 8, 32);
  const camHaloMat = new THREE.MeshBasicMaterial({
    color: '#0284c7',
    transparent: true,
    opacity: 0.9,
  });
  const camHalo = new THREE.Mesh(camHaloGeo, camHaloMat);
  camHalo.rotation.x = Math.PI / 2;
  camHalo.visible = false;
  cameraObjectGroup.add(camHalo);
  disposables.push(camHaloGeo, camHaloMat);

  // Camera local forward optical axis arrow (-Z local = forward)
  const fwdArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, -0.56),
    2.4,
    0x0284c7,
    0.34,
    0.16,
  );
  cameraObjectGroup.add(fwdArrow);

  // Floating "Camera C" badge
  const camBadgeTex = createBadgeSpriteTexture('Camera C', 'Monocular Rig', '#0284c7', 'camera');
  const camBadgeMat = new THREE.SpriteMaterial({
    map: camBadgeTex,
    depthTest: false,
    transparent: true,
    fog: false,
    toneMapped: false,
  });
  const camBadge = new THREE.Sprite(camBadgeMat);
  camBadge.position.set(0, 1.08, -0.2);
  camBadge.scale.set(2.3, 0.88, 1);
  camBadge.renderOrder = 26;
  cameraObjectGroup.add(camBadge);
  disposables.push(camBadgeTex, camBadgeMat);

  // Generous invisible click sphere for selecting the virtual camera
  const hitGeo = new THREE.SphereGeometry(0.95, 10, 10);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const cameraInteractable = new THREE.Mesh(hitGeo, hitMat);
  cameraInteractable.userData = { pickType: 'camera' };
  cameraObjectGroup.add(cameraInteractable);
  disposables.push(hitGeo, hitMat);

  // -------------------------------------------------------------------------
  // 2. Dynamic Camera Frustum + Virtual Image Sensor Plane (with projected 2D pixels!)
  // -------------------------------------------------------------------------
  const frustumLineGeo = new THREE.BufferGeometry();
  const frustumLineMat = new THREE.LineBasicMaterial({
    color: '#0284c7',
    transparent: true,
    opacity: 0.78,
  });
  const frustumLines = new THREE.LineSegments(frustumLineGeo, frustumLineMat);
  frustumGroup.add(frustumLines);
  disposables.push(frustumLineGeo, frustumLineMat);

  const imagePlaneGeo = new THREE.PlaneGeometry(1, 1);
  const imagePlaneMat = new THREE.MeshBasicMaterial({
    color: '#e0f2fe',
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const imagePlaneMesh = new THREE.Mesh(imagePlaneGeo, imagePlaneMat);
  imagePlaneMesh.position.set(0, 0, -FRUSTUM_PLANE_DIST);
  frustumGroup.add(imagePlaneMesh);
  disposables.push(imagePlaneGeo, imagePlaneMat);

  // 8 projected 2D pixel dots on the virtual image plane
  const pixelDotGeo = new THREE.SphereGeometry(0.048, 10, 8);
  const pixelDots: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const pm = new THREE.MeshBasicMaterial({ color: '#0284c7' });
    const dot = new THREE.Mesh(pixelDotGeo, pm);
    dot.visible = false;
    frustumGroup.add(dot);
    pixelDots.push(dot);
    disposables.push(pm);
  }
  disposables.push(pixelDotGeo);

  // -------------------------------------------------------------------------
  // 3. Observation Rays (C -> each of the 8 landmarks)
  // -------------------------------------------------------------------------
  const rayLines: THREE.Line[] = [];
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(0, 0, 1),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.45,
    });
    const line = new THREE.Line(geo, mat);
    raysGroup.add(line);
    rayLines.push(line);
    disposables.push(geo, mat);
  }

  // Emphasized thick tubular beams for the active landmark pair (A and B)
  const pairRayMatA = new THREE.MeshBasicMaterial({
    color: '#f59e0b',
    transparent: true,
    opacity: 0.92,
  });
  const pairRayMatB = new THREE.MeshBasicMaterial({
    color: '#ea580c',
    transparent: true,
    opacity: 0.92,
  });
  const unitRayUnitGeo = new THREE.CylinderGeometry(0.032, 0.032, 1, 8);
  unitRayUnitGeo.translate(0, 0.5, 0); // pivot at origin along +Y
  const pairBeamA = new THREE.Mesh(unitRayUnitGeo, pairRayMatA);
  const pairBeamB = new THREE.Mesh(unitRayUnitGeo, pairRayMatB);
  raysGroup.add(pairBeamA, pairBeamB);
  disposables.push(unitRayUnitGeo, pairRayMatA, pairRayMatB);

  // Back-projected unit ray ticks (from C through projected pixels on image sensor)
  const unitTipGeo = new THREE.SphereGeometry(0.085, 12, 10);
  const unitTipMatA = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
  const unitTipMatB = new THREE.MeshBasicMaterial({ color: '#ea580c' });
  const unitTipA = new THREE.Mesh(unitTipGeo, unitTipMatA);
  const unitTipB = new THREE.Mesh(unitTipGeo, unitTipMatB);
  angleWedgeGroup.add(unitTipA, unitTipB);
  disposables.push(unitTipGeo, unitTipMatA, unitTipMatB);

  // -------------------------------------------------------------------------
  // 4. Ray-Angle Wedge Mesh, Arc Line & Dynamic Angle Label Sprite
  // -------------------------------------------------------------------------
  const WEDGE_SEGMENTS = 28;
  const wedgeGeo = new THREE.BufferGeometry();
  const wedgePositions = new Float32Array((WEDGE_SEGMENTS + 2) * 3);
  const wedgeIndices: number[] = [];
  for (let i = 1; i <= WEDGE_SEGMENTS; i++) {
    wedgeIndices.push(0, i, i + 1);
  }
  wedgeGeo.setAttribute('position', new THREE.BufferAttribute(wedgePositions, 3));
  wedgeGeo.setIndex(wedgeIndices);
  const wedgeMat = new THREE.MeshBasicMaterial({
    color: '#f59e0b',
    transparent: true,
    opacity: 0.26,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const wedgeMesh = new THREE.Mesh(wedgeGeo, wedgeMat);
  angleWedgeGroup.add(wedgeMesh);
  disposables.push(wedgeGeo, wedgeMat);

  const arcGeo = new THREE.BufferGeometry();
  const arcPositions = new Float32Array((WEDGE_SEGMENTS + 1) * 3);
  arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPositions, 3));
  const arcMat = new THREE.LineBasicMaterial({ color: '#d97706' });
  const arcLine = new THREE.Line(arcGeo, arcMat);
  angleWedgeGroup.add(arcLine);
  disposables.push(arcGeo, arcMat);

  let angleBadgeTex = createBadgeSpriteTexture('θ = 0.0°', 'ID 0 ↔ ID 5', '#f59e0b', 'angle');
  const angleBadgeMat = new THREE.SpriteMaterial({
    map: angleBadgeTex,
    depthTest: false,
    transparent: true,
    fog: false,
    toneMapped: false,
  });
  const angleBadgeSprite = new THREE.Sprite(angleBadgeMat);
  angleBadgeSprite.scale.set(2.35, 0.88, 1);
  angleBadgeSprite.renderOrder = 30;
  angleWedgeGroup.add(angleBadgeSprite);
  disposables.push(angleBadgeMat);

  let lastAngleLabelKey = '';

  // -------------------------------------------------------------------------
  // 5. Simulation Demo Camera Trajectory Path
  // -------------------------------------------------------------------------
  const trajWorldPts = generateTrajectoryPoints(80);
  const trajThreePts = trajWorldPts.map((p) => {
    const t = worldToThree(p);
    return new THREE.Vector3(t.x, t.y, t.z);
  });
  const trajGeo = new THREE.BufferGeometry().setFromPoints(trajThreePts);
  const trajMat = new THREE.LineDashedMaterial({
    color: '#0ea5e9',
    dashSize: 0.55,
    gapSize: 0.3,
    transparent: true,
    opacity: 0.78,
  });
  const trajLine = new THREE.Line(trajGeo, trajMat);
  trajLine.computeLineDistances();
  trajectoryGroup.add(trajLine);
  disposables.push(trajGeo, trajMat);

  // Subtle waypoint dots along trajectory
  const wpGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const wpMat = new THREE.MeshBasicMaterial({ color: '#0284c7' });
  const wpCount = 9;
  const wpInstanced = new THREE.InstancedMesh(wpGeo, wpMat, wpCount);
  const wpDummy = new THREE.Object3D();
  for (let i = 0; i < wpCount; i++) {
    const idx = Math.floor((i / (wpCount - 1)) * (trajThreePts.length - 1));
    wpDummy.position.copy(trajThreePts[idx]);
    wpDummy.updateMatrix();
    wpInstanced.setMatrixAt(i, wpDummy.matrix);
  }
  wpInstanced.instanceMatrix.needsUpdate = true;
  wpInstanced.computeBoundingSphere();
  trajectoryGroup.add(wpInstanced);
  disposables.push(wpGeo, wpMat);

  // Pre-allocated scratch math helpers (zero GC inside update)
  const _rotMat = new THREE.Matrix4();
  const _rightT = new THREE.Vector3();
  const _upT = new THREE.Vector3();
  const _negFwdT = new THREE.Vector3();
  const _camPosT = new THREE.Vector3();
  const _targetPosT = new THREE.Vector3();
  const _dirA = new THREE.Vector3();
  const _dirB = new THREE.Vector3();
  const _interpDir = new THREE.Vector3();
  const _yAxis = new THREE.Vector3(0, 1, 0);

  function updateFrustumGeometry(intrinsics: CameraIntrinsics, farDist: number) {
    const halfW = (intrinsics.width / (2 * intrinsics.fx)) * FRUSTUM_PLANE_DIST;
    const halfH = (intrinsics.height / (2 * intrinsics.fy)) * FRUSTUM_PLANE_DIST;
    const farHalfW = (intrinsics.width / (2 * intrinsics.fx)) * farDist;
    const farHalfH = (intrinsics.height / (2 * intrinsics.fy)) * farDist;

    imagePlaneMesh.scale.set(halfW * 2, halfH * 2, 1);

    // Build frustum segments extending forward along local -Z
    const c = new THREE.Vector3(0, 0, 0);
    const nTL = new THREE.Vector3(-halfW, halfH, -FRUSTUM_PLANE_DIST);
    const nTR = new THREE.Vector3(halfW, halfH, -FRUSTUM_PLANE_DIST);
    const nBR = new THREE.Vector3(halfW, -halfH, -FRUSTUM_PLANE_DIST);
    const nBL = new THREE.Vector3(-halfW, -halfH, -FRUSTUM_PLANE_DIST);

    const fTL = new THREE.Vector3(-farHalfW, farHalfH, -farDist);
    const fTR = new THREE.Vector3(farHalfW, farHalfH, -farDist);
    const fBR = new THREE.Vector3(farHalfW, -farHalfH, -farDist);
    const fBL = new THREE.Vector3(-farHalfW, -farHalfH, -farDist);

    const segs = [
      c, fTL, c, fTR, c, fBR, c, fBL,
      nTL, nTR, nTR, nBR, nBR, nBL, nBL, nTL,
      fTL, fTR, fTR, fBR, fBR, fBL, fBL, fTL,
    ];
    frustumLineGeo.setFromPoints(segs);
  }

  return {
    group: rootGroup,
    cameraInteractable,
    updateCameraAndRays({
      cameraState,
      landmarks,
      intrinsics,
      pairAId,
      pairBId,
      rayAngleMode,
      showFrustum,
      showRays,
      showTrajectory,
      isSelected,
    }) {
      const basis = computeCameraBasis(cameraState);
      const posT = worldToThree(basis.position);
      const rT = worldToThree(basis.right);
      const uT = worldToThree(basis.up);
      const fT = worldToThree(basis.forward);

      _camPosT.set(posT.x, posT.y, posT.z);
      _rightT.set(rT.x, rT.y, rT.z).normalize();
      _upT.set(uT.x, uT.y, uT.z).normalize();
      // Right-handed basis: (+X = right, +Y = up, +Z = -forward => local -Z = +forward)
      _negFwdT.set(-fT.x, -fT.y, -fT.z).normalize();

      _rotMat.makeBasis(_rightT, _upT, _negFwdT);
      cameraObjectGroup.position.copy(_camPosT);
      cameraObjectGroup.quaternion.setFromRotationMatrix(_rotMat);

      camHalo.visible = isSelected;
      frustumGroup.visible = showFrustum;
      raysGroup.visible = showRays || rayAngleMode;
      trajectoryGroup.visible = showTrajectory;

      updateFrustumGeometry(intrinsics, rayAngleMode ? 7.5 : 5.8);

      // Update all 8 observation rays & projected 2D pixel dots on virtual image plane
      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        const proj = projectLandmarkToImage(lm, basis, intrinsics);
        const lmThree = worldToThree(lm.worldPos);

        // Update 2D projected pixel dot on the 3D virtual image sensor plane (at local z = -FRUSTUM_PLANE_DIST)
        const dot = pixelDots[i];
        if (dot) {
          if (proj.visibleInFrame && showFrustum) {
            const localX = ((proj.u - intrinsics.cx) / intrinsics.fx) * FRUSTUM_PLANE_DIST;
            const localY = -((proj.v - intrinsics.cy) / intrinsics.fy) * FRUSTUM_PLANE_DIST;
            dot.position.set(localX, localY, -FRUSTUM_PLANE_DIST);
            (dot.material as THREE.MeshBasicMaterial).color.set(
              lm.id === pairAId || lm.id === pairBId ? '#f59e0b' : lm.colorHex,
            );
            dot.scale.setScalar(lm.id === pairAId || lm.id === pairBId ? 1.55 : 1.0);
            dot.visible = true;
          } else {
            dot.visible = false;
          }
        }

        // Update sightline ray from C to P_i
        const rayLine = rayLines[i];
        if (rayLine) {
          const posAttr = rayLine.geometry.getAttribute('position') as THREE.BufferAttribute;
          posAttr.setXYZ(0, _camPosT.x, _camPosT.y, _camPosT.z);
          posAttr.setXYZ(1, lmThree.x, lmThree.y, lmThree.z);
          posAttr.needsUpdate = true;

          const rMat = rayLine.material as THREE.LineBasicMaterial;
          const isPair = lm.id === pairAId || lm.id === pairBId;
          if (isPair) {
            rMat.color.set('#f59e0b');
            rMat.opacity = 0.95;
          } else if (proj.visibleInFrame) {
            rMat.color.set(lm.colorHex);
            rMat.opacity = rayAngleMode ? 0.24 : 0.48;
          } else {
            rMat.color.set('#94a3b8');
            rMat.opacity = 0.16;
          }
          rayLine.visible = showRays || (rayAngleMode && isPair);
        }
      }

      // Update emphasized ray pair & dynamic angular wedge between Landmark A and Landmark B
      const lmA = landmarks.find((l) => l.id === pairAId);
      const lmB = landmarks.find((l) => l.id === pairBId);

      if (lmA && lmB && pairAId !== pairBId && (showRays || rayAngleMode)) {
        const analysis = analyzeRayAnglePair(lmA, lmB, basis, intrinsics);
        const pAT = worldToThree(lmA.worldPos);
        const pBT = worldToThree(lmB.worldPos);

        // Position emphasized pair beams from C to P_A and P_B
        _targetPosT.set(pAT.x, pAT.y, pAT.z);
        _dirA.subVectors(_targetPosT, _camPosT);
        const lenA = _dirA.length();
        _dirA.normalize();
        pairBeamA.position.copy(_camPosT);
        pairBeamA.quaternion.setFromUnitVectors(_yAxis, _dirA);
        pairBeamA.scale.set(1, lenA, 1);
        pairBeamA.visible = true;

        _targetPosT.set(pBT.x, pBT.y, pBT.z);
        _dirB.subVectors(_targetPosT, _camPosT);
        const lenB = _dirB.length();
        _dirB.normalize();
        pairBeamB.position.copy(_camPosT);
        pairBeamB.quaternion.setFromUnitVectors(_yAxis, _dirB);
        pairBeamB.scale.set(1, lenB, 1);
        pairBeamB.visible = true;

        // Build spherical-interpolation angular sector wedge between unit rays d_A and d_B
        const wedgeRadius = Math.min(rayAngleMode ? 7.8 : 5.4, Math.min(lenA, lenB) * 0.65);
        const wAttr = wedgeGeo.getAttribute('position') as THREE.BufferAttribute;
        const aAttr = arcGeo.getAttribute('position') as THREE.BufferAttribute;

        wAttr.setXYZ(0, _camPosT.x, _camPosT.y, _camPosT.z);

        const dotAB = THREE.MathUtils.clamp(_dirA.dot(_dirB), -1, 1);
        const omega = Math.acos(dotAB);
        const sinOmega = Math.sin(omega);

        for (let s = 0; s <= WEDGE_SEGMENTS; s++) {
          const frac = s / WEDGE_SEGMENTS;
          if (sinOmega > 1e-4) {
            const w0 = Math.sin((1 - frac) * omega) / sinOmega;
            const w1 = Math.sin(frac * omega) / sinOmega;
            _interpDir.set(
              _dirA.x * w0 + _dirB.x * w1,
              _dirA.y * w0 + _dirB.y * w1,
              _dirA.z * w0 + _dirB.z * w1,
            );
          } else {
            _interpDir.copy(_dirA).lerp(_dirB, frac).normalize();
          }
          const wx = _camPosT.x + _interpDir.x * wedgeRadius;
          const wy = _camPosT.y + _interpDir.y * wedgeRadius;
          const wz = _camPosT.z + _interpDir.z * wedgeRadius;
          wAttr.setXYZ(s + 1, wx, wy, wz);
          aAttr.setXYZ(s, wx, wy, wz);
        }
        wAttr.needsUpdate = true;
        aAttr.needsUpdate = true;
        wedgeGeo.computeBoundingSphere();
        arcGeo.computeBoundingSphere();

        // Unit ray tip markers at distance 4.2m along back-projected rays
        const unitVisDist = Math.min(4.2, wedgeRadius * 0.72);
        unitTipA.position.copy(_camPosT).addScaledVector(_dirA, unitVisDist);
        unitTipB.position.copy(_camPosT).addScaledVector(_dirB, unitVisDist);
        unitTipA.visible = rayAngleMode;
        unitTipB.visible = rayAngleMode;

        // Place dynamic angle sprite along bisector of the wedge
        _interpDir.copy(_dirA).add(_dirB).normalize();
        angleBadgeSprite.position
          .copy(_camPosT)
          .addScaledVector(_interpDir, wedgeRadius + 1.15);

        const labelKey = `${pairAId}-${pairBId}-${analysis.worldAngleDeg.toFixed(1)}`;
        if (labelKey !== lastAngleLabelKey) {
          lastAngleLabelKey = labelKey;
          const oldTex = angleBadgeTex;
          angleBadgeTex = createBadgeSpriteTexture(
            `θ = ${analysis.worldAngleDeg.toFixed(1)}°`,
            `ID ${pairAId} ↔ ID ${pairBId}`,
            '#f59e0b',
            'angle',
          );
          angleBadgeMat.map = angleBadgeTex;
          angleBadgeMat.needsUpdate = true;
          oldTex.dispose();
        }

        angleWedgeGroup.visible = true;
      } else {
        pairBeamA.visible = false;
        pairBeamB.visible = false;
        angleWedgeGroup.visible = false;
      }
    },
    dispose() {
      angleBadgeTex.dispose();
      for (const d of disposables) {
        d.dispose();
      }
    },
  };
}
