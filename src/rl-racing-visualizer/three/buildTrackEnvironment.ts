import * as THREE from 'three';
import { CONFIG, ObstacleBox, TrackSample } from '../sim/rlRacingMath';
import { ProceduralTexturePack } from './proceduralTextures';

export interface TrackEnvironmentRig {
  root: THREE.Group;
  obstacleGroup: THREE.Group;
  updateObstacles: (obstacles: ObstacleBox[], showAabbBoxes: boolean) => void;
  dispose: () => void;
}

function buildRibbonGeometry(
  track: TrackSample[],
  offsetLeft: number,
  offsetRight: number,
  yHeight: number,
  uvVScale = 0.08,
): THREE.BufferGeometry {
  const n = track.length;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= n; i++) {
    const s = track[i % n];
    const lx = s.x + s.nx * offsetLeft;
    const lz = s.z + s.nz * offsetLeft;
    const rx = s.x + s.nx * offsetRight;
    const rz = s.z + s.nz * offsetRight;
    const vCoord = (i === n ? track[n - 1].s + 3.0 : s.s) * uvVScale;

    positions.push(lx, yHeight, lz, rx, yHeight, rz);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, vCoord, 1, vCoord);
  }

  for (let i = 0; i < n; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, b, c, b, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/**
 * Builds the RacingCar closed-circuit environment:
 * - Expansive checkerboard grass terrain extending smoothly into horizon fog
 * - Asphalt track surface (ROAD_WIDTH = 10.0m, i.e., ±10m half-width matching RacingCar's dist <= ROAD_WIDTH)
 *   Wait: in RacingCar, dist <= ROAD_WIDTH (10.0) is on road, ROAD_WIDTH + 2.0 (12.0) is off-road boundary!
 * - Red/white alternating kerbs on both edges
 * - Yellow dashed centerline & translucent red off-road tolerance boundary
 * - Instanced composite low-poly trees along the outer/inner perimeter
 * - Dynamically updatable golden AABB obstacles
 */
export function buildTrackEnvironment(
  track: TrackSample[],
  textures: ProceduralTexturePack,
  darkMode: boolean,
): TrackEnvironmentRig {
  const root = new THREE.Group();
  root.name = 'TrackEnvironment';

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

  // 1. Expansive checkerboard meadow ground plane (y = 0)
  const groundGeo = trackGeo(new THREE.PlaneGeometry(1400, 1400));
  const groundMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.grassMap,
      roughness: 0.92,
      metalness: 0.0,
    }),
  );
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  groundMesh.receiveShadow = true;
  root.add(groundMesh);

  // 2. Asphalt road surface (y = 0.04, half-width = ROAD_WIDTH = 10.0m so total width = 20.0m matching RacingCar dist <= ROAD_WIDTH)
  const roadHalfW = CONFIG.ROAD_WIDTH;
  const roadGeo = trackGeo(buildRibbonGeometry(track, -roadHalfW, roadHalfW, 0.04, 0.09));
  const roadMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.asphaltMap,
      bumpMap: textures.asphaltBump,
      bumpScale: 0.05,
      roughness: 0.84,
      metalness: 0.04,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  roadMesh.receiveShadow = true;
  root.add(roadMesh);

  // 3. Alternating red/white beveled kerbs along ±ROAD_WIDTH (InstancedMesh)
  const kerbWidth = 1.15;
  const kerbGeo = trackGeo(new THREE.BoxGeometry(kerbWidth, 0.08, 3.1));
  const kerbMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );
  const kerbCount = track.length * 2;
  const kerbInst = new THREE.InstancedMesh(kerbGeo, kerbMat, kerbCount);
  kerbInst.receiveShadow = true;
  kerbInst.frustumCulled = false;

  const dummy = new THREE.Object3D();
  const redColor = new THREE.Color(0xd92626);
  const whiteColor = new THREE.Color(0xf1f5f9);
  let kIdx = 0;
  for (let i = 0; i < track.length; i++) {
    const s = track[i];
    const yaw = Math.atan2(s.tx, s.tz);
    for (const side of [-1, 1]) {
      dummy.position.set(
        s.x + s.nx * side * (roadHalfW + kerbWidth * 0.42),
        0.05,
        s.z + s.nz * side * (roadHalfW + kerbWidth * 0.42),
      );
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      kerbInst.setMatrixAt(kIdx, dummy.matrix);
      kerbInst.setColorAt(kIdx, i % 2 === 0 ? redColor : whiteColor);
      kIdx++;
    }
  }
  kerbInst.instanceMatrix.needsUpdate = true;
  if (kerbInst.instanceColor) kerbInst.instanceColor.needsUpdate = true;
  root.add(kerbInst);

  // 4. Yellow dashed centerline markings (y = 0.068)
  const dashGeo = trackGeo(new THREE.BoxGeometry(0.28, 0.015, 2.0));
  const dashMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: darkMode ? 0.35 : 0.15,
      roughness: 0.45,
    }),
  );
  const dashCount = Math.ceil(track.length / 2);
  const dashInst = new THREE.InstancedMesh(dashGeo, dashMat, dashCount);
  dashInst.frustumCulled = false;
  let dIdx = 0;
  for (let i = 0; i < track.length; i += 2) {
    const s = track[i];
    dummy.position.set(s.x, 0.068, s.z);
    dummy.rotation.set(0, Math.atan2(s.tx, s.tz), 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    dashInst.setMatrixAt(dIdx++, dummy.matrix);
  }
  dashInst.instanceMatrix.needsUpdate = true;
  root.add(dashInst);

  // 5. Off-road tolerance boundary lines at ±(ROAD_WIDTH + OFF_ROAD_TOLERANCE = 12.0m)
  const boundOffset = CONFIG.ROAD_WIDTH + CONFIG.OFF_ROAD_TOLERANCE;
  const boundMat = trackMat(
    new THREE.LineDashedMaterial({
      color: darkMode ? 0xf87171 : 0xdc2626,
      dashSize: 1.4,
      gapSize: 1.0,
      transparent: true,
      opacity: 0.72,
    }),
  );
  for (const side of [-1, 1]) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= track.length; i++) {
      const s = track[i % track.length];
      pts.push(new THREE.Vector3(s.x + s.nx * side * boundOffset, 0.09, s.z + s.nz * side * boundOffset));
    }
    const lineGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(pts));
    const line = new THREE.Line(lineGeo, boundMat);
    line.computeLineDistances();
    root.add(line);
  }

  // 6. Composite low-poly stylized trees lining the circuit perimeter (InstancedMesh trunks + 2 canopy tiers)
  const treePositions: Array<{ x: number; z: number; scale: number; tint: number }> = [];
  let seed = 918273;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < track.length; i += 3) {
    const s = track[i];
    for (const side of [-1, 1]) {
      const dist = boundOffset + 6.5 + rand() * 14.0;
      treePositions.push({
        x: s.x + s.nx * side * dist,
        z: s.z + s.nz * side * dist,
        scale: 0.85 + rand() * 0.35,
        tint: 0.88 + rand() * 0.24,
      });
    }
  }

  const trunkGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.38, 1.8, 7));
  trunkGeo.translate(0, 0.9, 0);
  const trunkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x6b4c35, roughness: 0.92 }));

  const crownLowerGeo = trackGeo(new THREE.ConeGeometry(1.75, 3.2, 7));
  crownLowerGeo.translate(0, 2.9, 0);
  const crownUpperGeo = trackGeo(new THREE.ConeGeometry(1.25, 2.5, 7));
  crownUpperGeo.translate(0, 4.6, 0);
  const crownMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: darkMode ? 0x2a573a : 0x3b7a4a,
      roughness: 0.84,
      metalness: 0.02,
    }),
  );

  const count = treePositions.length;
  const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
  const crownLInst = new THREE.InstancedMesh(crownLowerGeo, crownMat, count);
  const crownUInst = new THREE.InstancedMesh(crownUpperGeo, crownMat, count);
  trunkInst.frustumCulled = false;
  crownLInst.frustumCulled = false;
  crownUInst.frustumCulled = false;

  const baseCrownColor = new THREE.Color(darkMode ? 0x2a573a : 0x3b7a4a);
  const tmpColor = new THREE.Color();

  treePositions.forEach((tp, idx) => {
    dummy.position.set(tp.x, 0, tp.z);
    dummy.rotation.set(0, idx * 1.1, 0);
    dummy.scale.setScalar(tp.scale);
    dummy.updateMatrix();
    trunkInst.setMatrixAt(idx, dummy.matrix);
    crownLInst.setMatrixAt(idx, dummy.matrix);
    crownUInst.setMatrixAt(idx, dummy.matrix);

    tmpColor.copy(baseCrownColor).multiplyScalar(tp.tint);
    crownLInst.setColorAt(idx, tmpColor);
    crownUInst.setColorAt(idx, tmpColor);
  });
  trunkInst.instanceMatrix.needsUpdate = true;
  crownLInst.instanceMatrix.needsUpdate = true;
  crownUInst.instanceMatrix.needsUpdate = true;
  if (crownLInst.instanceColor) crownLInst.instanceColor.needsUpdate = true;
  if (crownUInst.instanceColor) crownUInst.instanceColor.needsUpdate = true;
  root.add(trunkInst, crownLInst, crownUInst);

  // 7. Dynamic Golden AABB Obstacle Group (composite 4-part barrier block)
  const obstacleGroup = new THREE.Group();
  obstacleGroup.name = 'TrackObstacles';
  root.add(obstacleGroup);

  const obsBodyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.obstacleHazardMap,
      roughness: 0.42,
      metalness: 0.18,
    }),
  );
  const obsCapMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x6b5309, // Matching COLOR_OBSTACLE_TOP (0.5, 0.4, 0.0)
      roughness: 0.65,
      metalness: 0.3,
    }),
  );
  const obsBumperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x262b34,
      roughness: 0.72,
      metalness: 0.45,
    }),
  );
  const obsWireMat = trackMat(
    new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
    }),
  );
  const obsShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: textures.contactShadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    }),
  );

  let dynamicDisposables: THREE.BufferGeometry[] = [];

  const updateObstacles = (obstacles: ObstacleBox[], showAabbBoxes: boolean) => {
    while (obstacleGroup.children.length > 0) {
      obstacleGroup.remove(obstacleGroup.children[0]);
    }
    dynamicDisposables.forEach((g) => g.dispose());
    dynamicDisposables = [];

    for (const obs of obstacles) {
      const g = new THREE.Group();
      g.position.set(obs.x, 0.04, obs.z);

      const w = obs.halfWidth * 2;
      const d = obs.halfDepth * 2;
      const h = obs.height;

      // Ground contact shadow
      const shGeo = new THREE.PlaneGeometry(w * 1.45, d * 1.45);
      dynamicDisposables.push(shGeo);
      const sh = new THREE.Mesh(shGeo, obsShadowMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.015;
      g.add(sh);

      // Lower steel bumper plinth
      const baseGeo = new THREE.BoxGeometry(w * 1.02, 0.24, d * 1.02);
      dynamicDisposables.push(baseGeo);
      const base = new THREE.Mesh(baseGeo, obsBumperMat);
      base.position.y = 0.12;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      // Primary amber hazard body
      const mainGeo = new THREE.BoxGeometry(w * 0.94, h - 0.42, d * 0.94);
      dynamicDisposables.push(mainGeo);
      const main = new THREE.Mesh(mainGeo, obsBodyMat);
      main.position.y = 0.24 + (h - 0.42) / 2;
      main.castShadow = true;
      main.receiveShadow = true;
      g.add(main);

      // Top beveled armor cap
      const capGeo = new THREE.BoxGeometry(w * 0.84, 0.18, d * 0.84);
      dynamicDisposables.push(capGeo);
      const cap = new THREE.Mesh(capGeo, obsCapMat);
      cap.position.y = h - 0.09;
      cap.castShadow = true;
      g.add(cap);

      // Optional crisp AABB collision bounding wireframe
      if (showAabbBoxes) {
        const boxGeo = new THREE.BoxGeometry(w + 0.08, h + 0.08, d + 0.08);
        const edgesGeo = new THREE.EdgesGeometry(boxGeo);
        boxGeo.dispose();
        dynamicDisposables.push(edgesGeo);
        const wire = new THREE.LineSegments(edgesGeo, obsWireMat);
        wire.position.y = h / 2 + 0.04;
        g.add(wire);
      }

      obstacleGroup.add(g);
    }
  };

  return {
    root,
    obstacleGroup,
    updateObstacles,
    dispose: () => {
      dynamicDisposables.forEach((g) => g.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
