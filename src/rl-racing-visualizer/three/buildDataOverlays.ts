import * as THREE from 'three';
import {
  CONFIG,
  ObservationSnapshot,
  ObstacleBox,
  RAY_ANGLES_DEG,
} from '../sim/rlRacingMath';
import {
  LayerVisibility,
  ProjectedSceneAnchors,
  RayScreenPoint,
  ScreenAnchor,
} from '../render/calloutLayout';

export interface DataOverlaysRig {
  root: THREE.Group;
  update: (
    snapshot: ObservationSnapshot,
    obstacles: ObstacleBox[],
    layers: LayerVisibility,
    frontRightTireWorld: THREE.Vector3,
    lidarOriginWorld: THREE.Vector3,
  ) => void;
  computeProjectedAnchors: (
    camera: THREE.Camera,
    snapshot: ObservationSnapshot,
    obstacles: ObstacleBox[],
    frontRightTireWorld: THREE.Vector3,
    lidarOriginWorld: THREE.Vector3,
  ) => ProjectedSceneAnchors;
  dispose: () => void;
}

const VISUAL_CLEAR_RAY_LEN = 26.0;
const _tmpProj = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);
const _dirVec = new THREE.Vector3();
const _midVec = new THREE.Vector3();

function projectWorldToScreen(world: THREE.Vector3, camera: THREE.Camera): ScreenAnchor {
  _tmpProj.copy(world).project(camera);
  const visible = _tmpProj.z >= -1 && _tmpProj.z <= 1;
  return {
    x: (_tmpProj.x + 1) * 0.5,
    y: (1 - _tmpProj.y) * 0.5,
    visible,
  };
}

/**
 * Builds crisp 3D scientific telemetry meshes in world space:
 * 1. 9-ray LiDAR fan beams + hit impact markers + ground protractor arc
 * 2. Tire velocity 3D vector arrow + rotational wheel spin arc at the tire
 * 3. Centerline perpendicular distance vector + closest-point beacon
 * 4. Heading angle θ ground sector wedge & World North (+Z) reference line
 * 5. World (x, z) ground coordinate triad beneath the car
 */
export function buildDataOverlays(darkMode: boolean): DataOverlaysRig {
  const root = new THREE.Group();
  root.name = 'RLDataOverlays';

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // --- Shared Materials ---
  const rayHitMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: darkMode ? 1.15 : 0.65,
      roughness: 0.25,
    }),
  );
  const rayClearMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: darkMode ? 0.95 : 0.45,
      transparent: true,
      opacity: 0.82,
      roughness: 0.25,
    }),
  );
  const hitRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    }),
  );
  const protractorMat = trackMat(
    new THREE.LineBasicMaterial({
      color: darkMode ? 0x38bdf8 : 0x0369a1,
      transparent: true,
      opacity: 0.55,
    }),
  );

  const speedArrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: darkMode ? 0.9 : 0.45,
      roughness: 0.22,
      metalness: 0.25,
    }),
  );
  const centerlineMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x7c3aed,
      emissiveIntensity: darkMode ? 0.95 : 0.5,
      roughness: 0.25,
    }),
  );
  const headingSectorMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: darkMode ? 0.34 : 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const headingLineMat = trackMat(
    new THREE.LineDashedMaterial({
      color: 0xd97706,
      dashSize: 0.5,
      gapSize: 0.35,
    }),
  );
  const axisXMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  const axisZMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));

  // =====================================================
  // 1. 9-RAY LIDAR FAN GROUP
  // =====================================================
  const raysGroup = new THREE.Group();
  root.add(raysGroup);

  const unitCylinderGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 1.0, 10));
  const hitSphereGeo = trackGeo(new THREE.SphereGeometry(0.24, 16, 16));
  const hitRingGeo = trackGeo(new THREE.RingGeometry(0.32, 0.48, 24));
  const clearTipGeo = trackGeo(new THREE.OctahedronGeometry(0.18, 0));

  const rayBeams: THREE.Mesh[] = [];
  const rayHitMarkers: THREE.Group[] = [];
  const rayClearTips: THREE.Mesh[] = [];

  for (let i = 0; i < RAY_ANGLES_DEG.length; i++) {
    const beam = new THREE.Mesh(unitCylinderGeo, rayClearMat);
    raysGroup.add(beam);
    rayBeams.push(beam);

    const hitGrp = new THREE.Group();
    const sphere = new THREE.Mesh(hitSphereGeo, rayHitMat);
    const ring = new THREE.Mesh(hitRingGeo, hitRingMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    hitGrp.add(sphere, ring);
    hitGrp.visible = false;
    raysGroup.add(hitGrp);
    rayHitMarkers.push(hitGrp);

    const tip = new THREE.Mesh(clearTipGeo, rayClearMat);
    tip.visible = false;
    raysGroup.add(tip);
    rayClearTips.push(tip);
  }

  // Ground radar protractor arc spanning -90° to +90° (car local +Z forward)
  const protractorGroup = new THREE.Group();
  const arcPts: THREE.Vector3[] = [];
  const arcR = 7.4;
  for (let deg = -90; deg <= 90; deg += 3) {
    const r = (deg * Math.PI) / 180;
    arcPts.push(new THREE.Vector3(Math.sin(r) * arcR, 0.1, Math.cos(r) * arcR));
  }
  const arcLine = new THREE.Line(trackGeo(new THREE.BufferGeometry().setFromPoints(arcPts)), protractorMat);
  protractorGroup.add(arcLine);

  // Tick marks at exact 9 ray angles
  const tickPts: THREE.Vector3[] = [];
  for (const deg of RAY_ANGLES_DEG) {
    const r = (deg * Math.PI) / 180;
    const innerR = deg === 0 ? arcR - 0.9 : arcR - 0.55;
    tickPts.push(
      new THREE.Vector3(Math.sin(r) * innerR, 0.1, Math.cos(r) * innerR),
      new THREE.Vector3(Math.sin(r) * (arcR + 0.35), 0.1, Math.cos(r) * (arcR + 0.35)),
    );
  }
  const ticksLine = new THREE.LineSegments(
    trackGeo(new THREE.BufferGeometry().setFromPoints(tickPts)),
    protractorMat,
  );
  protractorGroup.add(ticksLine);
  raysGroup.add(protractorGroup);

  // =====================================================
  // 2. TIRE VELOCITY 3D ARROW + SPIN ARC GROUP
  // =====================================================
  const speedGroup = new THREE.Group();
  root.add(speedGroup);

  const speedShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 1.0, 14)),
    speedArrowMat,
  );
  speedShaft.rotation.x = Math.PI / 2; // Align along +Z
  speedGroup.add(speedShaft);

  const speedHead = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.24, 0.62, 16)),
    speedArrowMat,
  );
  speedHead.rotation.x = Math.PI / 2;
  speedGroup.add(speedHead);

  // Curved rotational velocity arc hugging the outer tire rim
  const spinArcGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.042, 10, 28, Math.PI * 1.15));
  spinArcGeo.rotateY(Math.PI / 2); // Lie in YZ plane beside the tire
  const spinArc = new THREE.Mesh(spinArcGeo, speedArrowMat);
  spinArc.position.set(-0.26, 0, 0);
  spinArc.rotation.x = -Math.PI * 0.35;
  speedGroup.add(spinArc);

  const spinHead = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.11, 0.26, 12)), speedArrowMat);
  spinHead.position.set(-0.26, 0.48, 0.28);
  spinHead.rotation.x = Math.PI * 0.35;
  speedGroup.add(spinHead);

  // Pointer ring circling the tire hub
  const tireRingGeo = trackGeo(new THREE.TorusGeometry(0.42, 0.032, 10, 32));
  tireRingGeo.rotateY(Math.PI / 2);
  const tireRing = new THREE.Mesh(tireRingGeo, speedArrowMat);
  tireRing.position.set(-0.22, 0, 0);
  speedGroup.add(tireRing);

  // =====================================================
  // 3. CENTERLINE OFFSET & DIRECTION VECTOR GROUP (obs[4..6])
  // =====================================================
  const centerlineGroup = new THREE.Group();
  root.add(centerlineGroup);

  const centerShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 1.0, 12)),
    centerlineMat,
  );
  centerlineGroup.add(centerShaft);

  const centerHead = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.24, 0.64, 14)),
    centerlineMat,
  );
  centerlineGroup.add(centerHead);

  const closestBeaconRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(0.32, 0.56, 28)),
    trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
      }),
    ),
  );
  closestBeaconRing.rotation.x = -Math.PI / 2;
  centerlineGroup.add(closestBeaconRing);

  const closestPin = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 10)),
    centerlineMat,
  );
  centerlineGroup.add(closestPin);

  // =====================================================
  // 4. HEADING ANGLE θ PROTRACTOR & WORLD (x, z) TRIAD
  // =====================================================
  const headingPosGroup = new THREE.Group();
  root.add(headingPosGroup);

  // North (+Z) reference line from car origin
  const northLineGeo = trackGeo(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.14, 0),
      new THREE.Vector3(0, 0.14, 5.8),
    ]),
  );
  const northLine = new THREE.Line(northLineGeo, headingLineMat);
  northLine.computeLineDistances();
  headingPosGroup.add(northLine);

  // Heading sector mesh (dynamically updated arc)
  const headingSectorMesh = new THREE.Mesh(new THREE.BufferGeometry(), headingSectorMat);
  headingSectorMesh.position.y = 0.12;
  headingPosGroup.add(headingSectorMesh);

  // Ground (X, Z) coordinate crosshair beneath car
  const xBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.6, 0.04, 0.08)), axisXMat);
  xBar.position.set(1.3, 0.15, 0);
  const xTip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.14, 0.34, 10)), axisXMat);
  xTip.rotation.z = -Math.PI / 2;
  xTip.position.set(2.68, 0.15, 0);

  const zBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.04, 2.6)), axisZMat);
  zBar.position.set(0, 0.15, 1.3);
  const zTip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.14, 0.34, 10)), axisZMat);
  zTip.rotation.x = Math.PI / 2;
  zTip.position.set(0, 0.15, 2.68);
  headingPosGroup.add(xBar, xTip, zBar, zTip);

  // Scratch vectors for update
  const _startPos = new THREE.Vector3();
  const _endPos = new THREE.Vector3();
  const _quat = new THREE.Quaternion();

  const update = (
    snapshot: ObservationSnapshot,
    _obstacles: ObstacleBox[],
    layers: LayerVisibility,
    frontRightTireWorld: THREE.Vector3,
    lidarOriginWorld: THREE.Vector3,
  ) => {
    const carYawRad = (snapshot.carAngleDeg * Math.PI) / 180;

    // 1. Update 9 LiDAR rays
    raysGroup.visible = layers.rays;
    if (layers.rays) {
      protractorGroup.position.set(snapshot.carX, 0, snapshot.carZ);
      protractorGroup.rotation.y = carYawRad;

      snapshot.rays.forEach((ray, i) => {
        const visualLen = ray.hit
          ? Math.max(0.8, ray.distance)
          : VISUAL_CLEAR_RAY_LEN;
        _startPos.copy(lidarOriginWorld);
        const endY = ray.hit ? 1.12 : 0.72;
        _endPos.set(
          snapshot.carX + ray.dirX * visualLen,
          endY,
          snapshot.carZ + ray.dirZ * visualLen,
        );

        _dirVec.subVectors(_endPos, _startPos);
        const len = _dirVec.length();
        _midVec.addVectors(_startPos, _endPos).multiplyScalar(0.5);

        const beam = rayBeams[i];
        beam.material = ray.hit ? rayHitMat : rayClearMat;
        beam.position.copy(_midVec);
        beam.scale.set(ray.hit ? 1.45 : 0.9, len, ray.hit ? 1.45 : 0.9);
        _dirVec.normalize();
        _quat.setFromUnitVectors(_upVec, _dirVec);
        beam.quaternion.copy(_quat);

        const hitMarker = rayHitMarkers[i];
        const clearTip = rayClearTips[i];
        if (ray.hit) {
          hitMarker.visible = true;
          hitMarker.position.copy(_endPos);
          clearTip.visible = false;
        } else {
          hitMarker.visible = false;
          clearTip.visible = true;
          clearTip.position.copy(_endPos);
        }
      });
    }

    // 2. Update Tire Velocity Arrow at front-right tire
    speedGroup.visible = layers.speedArrow;
    if (layers.speedArrow) {
      speedGroup.position.copy(frontRightTireWorld);
      speedGroup.rotation.y = carYawRad;
      const normV = Math.max(0.12, snapshot.speed / CONFIG.CAR_BASE_SPEED);
      const arrowLen = 0.85 + normV * 2.35;
      // Place slightly outside right tire (-X in car local coords)
      speedShaft.scale.set(1, arrowLen, 1);
      speedShaft.position.set(-0.48, 0.04, arrowLen * 0.5);
      speedHead.position.set(-0.48, 0.04, arrowLen + 0.28);
      spinArc.visible = snapshot.speed > 0.02;
      spinHead.visible = snapshot.speed > 0.02;
    }

    // 3. Update Centerline Offset & Direction Vector (obs[4..6])
    centerlineGroup.visible = layers.centerline;
    if (layers.centerline) {
      const dist = snapshot.trackDist;
      const yLevel = 0.26;
      closestBeaconRing.position.set(snapshot.closestPoint.x, 0.11, snapshot.closestPoint.z);
      closestPin.position.set(snapshot.closestPoint.x, 0.62, snapshot.closestPoint.z);

      if (dist > 0.35) {
        centerShaft.visible = true;
        centerHead.visible = true;
        _startPos.set(snapshot.carX, yLevel, snapshot.carZ);
        _endPos.set(snapshot.closestPoint.x, yLevel, snapshot.closestPoint.z);
        _dirVec.subVectors(_endPos, _startPos);
        const len = _dirVec.length();
        const shaftLen = Math.max(0.1, len - 0.64);
        _dirVec.normalize();

        _midVec.copy(_startPos).addScaledVector(_dirVec, shaftLen * 0.5);
        centerShaft.position.copy(_midVec);
        centerShaft.scale.set(1, shaftLen, 1);
        _quat.setFromUnitVectors(_upVec, _dirVec);
        centerShaft.quaternion.copy(_quat);

        centerHead.position.copy(_startPos).addScaledVector(_dirVec, shaftLen + 0.32);
        centerHead.quaternion.copy(_quat);
      } else {
        centerShaft.visible = false;
        centerHead.visible = false;
      }
    }

    // 4. Update Heading Angle Sector & World (x, z) Crosshair
    headingPosGroup.visible = layers.headingAndPos;
    if (layers.headingAndPos) {
      headingPosGroup.position.set(snapshot.carX, 0, snapshot.carZ);
      // Rebuild clean thin fan wedge from World +Z (0 rad) to carYawRad
      headingSectorMesh.geometry.dispose();
      const segs = 28;
      const r = 4.4;
      // Normalize angle into [-PI, PI] for cleanest shortest visual sector
      let deltaRad = carYawRad;
      while (deltaRad > Math.PI) deltaRad -= Math.PI * 2;
      while (deltaRad < -Math.PI) deltaRad += Math.PI * 2;
      if (Math.abs(deltaRad) < 0.04) deltaRad = 0.08;

      const verts: number[] = [];
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * deltaRad;
        const a1 = ((i + 1) / segs) * deltaRad;
        verts.push(
          0, 0, 0,
          Math.sin(a0) * r, 0, Math.cos(a0) * r,
          Math.sin(a1) * r, 0, Math.cos(a1) * r,
        );
      }
      const sectorGeo = new THREE.BufferGeometry();
      sectorGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      headingSectorMesh.geometry = sectorGeo;
    }
  };

  const computeProjectedAnchors = (
    camera: THREE.Camera,
    snapshot: ObservationSnapshot,
    obstacles: ObstacleBox[],
    frontRightTireWorld: THREE.Vector3,
    lidarOriginWorld: THREE.Vector3,
  ): ProjectedSceneAnchors => {
    const carYawRad = (snapshot.carAngleDeg * Math.PI) / 180;
    const fwdX = Math.sin(carYawRad);
    const fwdZ = Math.cos(carYawRad);
    const rightX = -Math.cos(carYawRad);
    const rightZ = Math.sin(carYawRad);

    // 1. Tire speed anchor pointing directly at the outer face of the front-right tire & speed arrow
    const tireAnchorWorld = frontRightTireWorld
      .clone()
      .add(new THREE.Vector3(rightX * 0.28 + fwdX * 0.12, 0.08, rightZ * 0.28 + fwdZ * 0.12));
    const tireSpeed = projectWorldToScreen(tireAnchorWorld, camera);

    // 2. Centerline vector anchor
    const clWorld = new THREE.Vector3(
      (snapshot.carX + snapshot.closestPoint.x) * 0.5,
      0.38,
      (snapshot.carZ + snapshot.closestPoint.z) * 0.5,
    );
    const centerlineVec = projectWorldToScreen(clWorld, camera);

    // 3. Heading arc anchor (midway along the sector rim)
    let deltaRad = carYawRad;
    while (deltaRad > Math.PI) deltaRad -= Math.PI * 2;
    while (deltaRad < -Math.PI) deltaRad += Math.PI * 2;
    const halfAngle = deltaRad * 0.5;
    const headingWorld = new THREE.Vector3(
      snapshot.carX + Math.sin(halfAngle) * 4.4,
      0.22,
      snapshot.carZ + Math.cos(halfAngle) * 4.4,
    );
    const headingArc = projectWorldToScreen(headingWorld, camera);

    // 4. World origin crosshair
    const worldOrigin = projectWorldToScreen(
      new THREE.Vector3(snapshot.carX + 1.4, 0.25, snapshot.carZ + 1.4),
      camera,
    );

    // 5. Rays projection
    const rayTips: RayScreenPoint[] = snapshot.rays.map((ray) => {
      const visualLen = ray.hit ? ray.distance : VISUAL_CLEAR_RAY_LEN;
      const tipWorld = new THREE.Vector3(
        snapshot.carX + ray.dirX * visualLen,
        ray.hit ? 1.32 : 0.88,
        snapshot.carZ + ray.dirZ * visualLen,
      );
      const proj = projectWorldToScreen(tipWorld, camera);
      return {
        ...proj,
        angleDeg: ray.angleDeg,
        obsIndex: ray.obsIndex,
        distance: ray.distance,
        normalized: ray.normalized,
        hit: ray.hit,
      };
    });

    const hitRays = snapshot.rays
      .filter((r) => r.hit)
      .sort((a, b) => a.distance - b.distance);

    let primaryHitRay: ProjectedSceneAnchors['primaryHitRay'] = null;
    let secondaryHitRay: ProjectedSceneAnchors['secondaryHitRay'] = null;

    if (hitRays.length > 0) {
      const r = hitRays[0];
      const midWorld = new THREE.Vector3(
        lidarOriginWorld.x + r.dirX * r.distance * 0.65,
        1.22,
        lidarOriginWorld.z + r.dirZ * r.distance * 0.65,
      );
      const p = projectWorldToScreen(midWorld, camera);
      primaryHitRay = {
        ...p,
        angleDeg: r.angleDeg,
        obsIndex: r.obsIndex,
        distance: r.distance,
        normalized: r.normalized,
      };
    }

    if (hitRays.length > 1) {
      const r = hitRays[hitRays.length - 1];
      const midWorld = new THREE.Vector3(
        lidarOriginWorld.x + r.dirX * r.distance * 0.72,
        1.22,
        lidarOriginWorld.z + r.dirZ * r.distance * 0.72,
      );
      const p = projectWorldToScreen(midWorld, camera);
      secondaryHitRay = {
        ...p,
        angleDeg: r.angleDeg,
        obsIndex: r.obsIndex,
        distance: r.distance,
        normalized: r.normalized,
      };
    }

    // Pick a clean unobstructed fan ray (-30° or +30° preferred for diagram clarity)
    const clearPrefOrder = [1, 7, 2, 6, 0, 8, 4];
    let clearFanRay: ProjectedSceneAnchors['clearFanRay'] = null;
    for (const idx of clearPrefOrder) {
      const r = snapshot.rays[idx];
      if (!r.hit) {
        const ptWorld = new THREE.Vector3(
          snapshot.carX + r.dirX * (VISUAL_CLEAR_RAY_LEN * 0.62),
          0.95,
          snapshot.carZ + r.dirZ * (VISUAL_CLEAR_RAY_LEN * 0.62),
        );
        const p = projectWorldToScreen(ptWorld, camera);
        clearFanRay = {
          ...p,
          angleDeg: r.angleDeg,
          obsIndex: r.obsIndex,
          distance: r.distance,
          normalized: r.normalized,
        };
        break;
      }
    }

    // 6. Primary obstacle AABB anchor
    let obstacleBox: ScreenAnchor | null = null;
    const hitObsId = hitRays[0]?.hitObstacleId ?? obstacles[0]?.id;
    const hitObs = obstacles.find((o) => o.id === hitObsId);
    if (hitObs) {
      obstacleBox = projectWorldToScreen(
        new THREE.Vector3(hitObs.x, hitObs.height + 0.15, hitObs.z),
        camera,
      );
    }

    // 7. Off-road boundary anchor
    const boundDist = CONFIG.ROAD_WIDTH + CONFIG.OFF_ROAD_TOLERANCE;
    const offRoadWorld = new THREE.Vector3(
      snapshot.closestPoint.x - snapshot.closestTangent.z * boundDist,
      0.15,
      snapshot.closestPoint.z + snapshot.closestTangent.x * boundDist,
    );
    const offRoadBoundary = projectWorldToScreen(offRoadWorld, camera);

    return {
      tireSpeed,
      centerlineVec,
      headingArc,
      worldOrigin,
      primaryHitRay,
      secondaryHitRay,
      clearFanRay,
      obstacleBox,
      offRoadBoundary,
      rayTips,
    };
  };

  return {
    root,
    update,
    computeProjectedAnchors,
    dispose: () => {
      headingSectorMesh.geometry.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
