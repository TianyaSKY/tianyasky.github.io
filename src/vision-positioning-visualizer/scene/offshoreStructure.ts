import * as THREE from 'three';
import type { LandmarkSpec, StructureParams, ViewMode } from '../data/visionPositioningConfig';
import { worldToThree } from '../geometry/visionMath';
import { createBadgeSpriteTexture, type ProceduralTexturePack } from './proceduralTextures';

export interface OffshoreStructureHandle {
  group: THREE.Group;
  interactables: THREE.Object3D[];
  rebuild: (params: StructureParams, landmarks: LandmarkSpec[]) => void;
  setDisplayState: (opts: {
    mode: ViewMode;
    showLabels: boolean;
    showWireframe: boolean;
    selectedLandmarkId: number | null;
    pairAId: number;
    pairBId: number;
    rayAngleMode: boolean;
  }) => void;
  dispose: () => void;
}

/**
 * Helper to place a cylinder strut cleanly between two 3D points.
 */
function createStrutBetween(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  radialSegments = 10,
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, radialSegments);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Builds the composite multi-part nearshore offshore monitoring structure
 * containing the 4 vertical steel pylon pairs and exact 3D semantic corner targets (IDs 0–7).
 * Both Realistic Mode and Scientific Mode share this exact underlying geometry.
 */
export function createOffshoreStructure(
  textures: ProceduralTexturePack,
): OffshoreStructureHandle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'OffshoreMonitoringStructure';

  const solidGroup = new THREE.Group();
  const wireframeGroup = new THREE.Group();
  const landmarkGroup = new THREE.Group();
  const labelGroup = new THREE.Group();
  const tierGuidesGroup = new THREE.Group();

  rootGroup.add(solidGroup, wireframeGroup, landmarkGroup, labelGroup, tierGuidesGroup);

  // Shared PBR material library with distinct roughness/metalness contrast between adjacent parts
  const concreteMat = new THREE.MeshStandardMaterial({
    color: '#93999f',
    roughness: 0.88,
    metalness: 0.04,
    bumpMap: textures.concreteBump,
    bumpScale: 0.08,
  });

  const splashZoneMat = new THREE.MeshStandardMaterial({
    color: '#4f5d5e',
    roughness: 0.62,
    metalness: 0.12,
    bumpMap: textures.concreteBump,
    bumpScale: 0.1,
  });

  const lowerSteelMat = new THREE.MeshStandardMaterial({
    color: '#4c6173',
    roughness: 0.44,
    metalness: 0.56,
    bumpMap: textures.steelBump,
    bumpScale: 0.04,
    roughnessMap: textures.steelRoughness,
  });

  const upperSteelMat = new THREE.MeshStandardMaterial({
    color: '#637a8c',
    roughness: 0.34,
    metalness: 0.68,
    bumpMap: textures.steelBump,
    bumpScale: 0.035,
    roughnessMap: textures.steelRoughness,
  });

  const flangeMat = new THREE.MeshStandardMaterial({
    color: '#2c3844',
    roughness: 0.28,
    metalness: 0.84,
  });

  const catwalkMat = new THREE.MeshStandardMaterial({
    color: '#7a8792',
    roughness: 0.52,
    metalness: 0.62,
  });

  const safetyYellowMat = new THREE.MeshStandardMaterial({
    color: '#d49a2a',
    roughness: 0.48,
    metalness: 0.22,
  });

  const bracketMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.26,
    metalness: 0.82,
  });

  const foamMat = new THREE.MeshBasicMaterial({
    map: textures.foamRing,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });

  const wireLineMat = new THREE.LineBasicMaterial({
    color: '#1e293b',
    transparent: true,
    opacity: 0.62,
  });

  const tierGuideMat = new THREE.LineDashedMaterial({
    color: '#64748b',
    dashSize: 0.45,
    gapSize: 0.28,
    transparent: true,
    opacity: 0.68,
  });

  const permanentMaterials = [
    concreteMat,
    splashZoneMat,
    lowerSteelMat,
    upperSteelMat,
    flangeMat,
    catwalkMat,
    safetyYellowMat,
    bracketMat,
    foamMat,
    wireLineMat,
    tierGuideMat,
  ];

  let dynamicDisposables: Array<{ dispose: () => void }> = [];
  let interactables: THREE.Object3D[] = [];

  interface LandmarkVisualRecord {
    id: number;
    coreMesh: THREE.Mesh;
    haloMesh: THREE.Mesh;
    ringMat: THREE.MeshBasicMaterial;
    labelSprite: THREE.Sprite;
    baseColorHex: string;
    labelPrimary: string;
    labelSecondary: string;
  }
  let landmarkRecords: LandmarkVisualRecord[] = [];
  let foamMeshes: THREE.Mesh[] = [];

  function clearDynamic() {
    for (const grp of [solidGroup, wireframeGroup, landmarkGroup, labelGroup, tierGuidesGroup]) {
      while (grp.children.length > 0) {
        grp.remove(grp.children[0]);
      }
    }
    for (const d of dynamicDisposables) {
      d.dispose();
    }
    dynamicDisposables = [];
    interactables = [];
    landmarkRecords = [];
    foamMeshes = [];
  }

  function addSolidWithWire(mesh: THREE.Mesh, includeWire = true) {
    solidGroup.add(mesh);
    if (includeWire && mesh.geometry) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
      const line = new THREE.LineSegments(edges, wireLineMat);
      line.position.copy(mesh.position);
      line.quaternion.copy(mesh.quaternion);
      line.scale.copy(mesh.scale);
      wireframeGroup.add(line);
      dynamicDisposables.push(edges);
    }
  }

  function rebuild(params: StructureParams, landmarks: LandmarkSpec[]) {
    clearDynamic();

    const lowerY = params.lowerZ; // World Z=4 -> Three Y=4
    const upperY = params.upperZ; // World Z=8 -> Three Y=8

    // Group landmarks into 4 vertical pillar pairs
    const pillars: Array<{ lower: LandmarkSpec; upper: LandmarkSpec }> = [];
    for (let p = 1; p <= 4; p++) {
      const lower = landmarks.find((l) => l.pairIndex === p && l.tier === 'lower')!;
      const upper = landmarks.find((l) => l.pairIndex === p && l.tier === 'upper')!;
      if (lower && upper) pillars.push({ lower, upper });
    }

    // Shared geometries for pillar sub-parts
    const caissonGeo = new THREE.CylinderGeometry(0.62, 0.72, 3.6, 12);
    const splashGeo = new THREE.CylinderGeometry(0.66, 0.68, 1.15, 12);
    const baseFlangeGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.16, 16);
    const lowerShaftLen = Math.max(0.5, lowerY - 1.25);
    const lowerShaftGeo = new THREE.CylinderGeometry(0.32, 0.36, lowerShaftLen, 16);
    const midHubGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.24, 16);
    const upperShaftLen = Math.max(0.5, upperY - lowerY);
    const upperShaftGeo = new THREE.CylinderGeometry(0.25, 0.29, upperShaftLen, 16);
    const topCapGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.2, 16);
    const finialGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.75, 10);
    const gussetGeo = new THREE.BoxGeometry(0.62, 0.42, 0.07);
    const foamGeo = new THREE.PlaneGeometry(3.4, 3.4);
    foamGeo.rotateX(-Math.PI / 2);

    // Instanced flange bolts across all 4 pillars (4 pillars × 3 flanges × 8 bolts = 96 bolts)
    const boltGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.24, 6);
    const boltInstanced = new THREE.InstancedMesh(boltGeo, flangeMat, pillars.length * 3 * 8);
    const boltDummy = new THREE.Object3D();
    let boltIdx = 0;

    dynamicDisposables.push(
      caissonGeo,
      splashGeo,
      baseFlangeGeo,
      lowerShaftGeo,
      midHubGeo,
      upperShaftGeo,
      topCapGeo,
      finialGeo,
      gussetGeo,
      foamGeo,
      boltGeo,
    );

    const lowerThreePts: THREE.Vector3[] = [];
    const upperThreePts: THREE.Vector3[] = [];

    for (let i = 0; i < pillars.length; i++) {
      const { lower, upper } = pillars[i];
      const lp = worldToThree(lower.worldPos);
      const up = worldToThree(upper.worldPos);
      lowerThreePts.push(new THREE.Vector3(lp.x, lp.y, lp.z));
      upperThreePts.push(new THREE.Vector3(up.x, up.y, up.z));

      const px = lp.x;
      const pz = lp.z;

      // 1. Submerged concrete caisson footing (y = -2.4 .. +1.2)
      const caisson = new THREE.Mesh(caissonGeo, concreteMat);
      caisson.position.set(px, -0.6, pz);
      caisson.castShadow = true;
      caisson.receiveShadow = true;
      addSolidWithWire(caisson);

      // 2. Tidal splash zone collar
      const splash = new THREE.Mesh(splashGeo, splashZoneMat);
      splash.position.set(px, 0.25, pz);
      splash.receiveShadow = true;
      addSolidWithWire(splash, false);

      // 3. Waterline foam ring (Realistic mode)
      const foam = new THREE.Mesh(foamGeo, foamMat);
      foam.position.set(px, 0.04, pz);
      solidGroup.add(foam);
      foamMeshes.push(foam);

      // 4. Heavy steel base flange
      const baseFlange = new THREE.Mesh(baseFlangeGeo, flangeMat);
      baseFlange.position.set(px, 1.24, pz);
      baseFlange.castShadow = true;
      addSolidWithWire(baseFlange, false);

      // 5. Lower tubular steel column shaft
      const lowerShaft = new THREE.Mesh(lowerShaftGeo, lowerSteelMat);
      lowerShaft.position.set(px, 1.25 + lowerShaftLen / 2, pz);
      lowerShaft.castShadow = true;
      lowerShaft.receiveShadow = true;
      addSolidWithWire(lowerShaft);

      // 6. Mid-tier structural flange hub at z = 4.0 m
      const midHub = new THREE.Mesh(midHubGeo, flangeMat);
      midHub.position.set(px, lowerY, pz);
      midHub.castShadow = true;
      addSolidWithWire(midHub);

      // Welded cross gusset plates at z = 4.0 m
      const gussetA = new THREE.Mesh(gussetGeo, lowerSteelMat);
      gussetA.position.set(px, lowerY - 0.26, pz);
      addSolidWithWire(gussetA, false);
      const gussetB = new THREE.Mesh(gussetGeo, lowerSteelMat);
      gussetB.position.set(px, lowerY - 0.26, pz);
      gussetB.rotation.y = Math.PI / 2;
      addSolidWithWire(gussetB, false);

      // 7. Upper tubular steel column shaft (z = 4.0 .. 8.0 m)
      const upperShaft = new THREE.Mesh(upperShaftGeo, upperSteelMat);
      upperShaft.position.set(px, lowerY + upperShaftLen / 2, pz);
      upperShaft.castShadow = true;
      upperShaft.receiveShadow = true;
      addSolidWithWire(upperShaft);

      // 8. Top flange cap at z = 8.0 m & mast finial
      const topCap = new THREE.Mesh(topCapGeo, flangeMat);
      topCap.position.set(px, upperY, pz);
      topCap.castShadow = true;
      addSolidWithWire(topCap);

      const finial = new THREE.Mesh(finialGeo, upperSteelMat);
      finial.position.set(px, upperY + 0.46, pz);
      addSolidWithWire(finial, false);

      // Populate instanced bolts around the 3 flange elevations
      const boltLevels = [
        { y: 1.24, r: 0.46 },
        { y: lowerY, r: 0.39 },
        { y: upperY, r: 0.31 },
      ];
      for (const bl of boltLevels) {
        for (let b = 0; b < 8; b++) {
          const ang = (b / 8) * Math.PI * 2;
          boltDummy.position.set(px + Math.cos(ang) * bl.r, bl.y, pz + Math.sin(ang) * bl.r);
          boltDummy.rotation.set(0, 0, 0);
          boltDummy.scale.set(1, 1, 1);
          boltDummy.updateMatrix();
          boltInstanced.setMatrixAt(boltIdx++, boltDummy.matrix);
        }
      }
    }

    boltInstanced.instanceMatrix.needsUpdate = true;
    boltInstanced.computeBoundingSphere();
    solidGroup.add(boltInstanced);

    // -----------------------------------------------------------------------
    // Horizontal Girders, Diagonal Cross-Bracing, Service Catwalk & Ladder
    // -----------------------------------------------------------------------
    const bayEdges: Array<[number, number]> =
      params.layout === 'offshore-frame'
        ? [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ]
        : [
            [0, 1],
            [1, 2],
            [2, 3],
          ];

    for (const [a, b] of bayEdges) {
      const la = lowerThreePts[a];
      const lb = lowerThreePts[b];
      const ua = upperThreePts[a];
      const ub = upperThreePts[b];

      // Lower horizontal girder at z = 4.0 m
      const lowerBeam = createStrutBetween(la, lb, 0.14, lowerSteelMat, 8);
      addSolidWithWire(lowerBeam);
      dynamicDisposables.push(lowerBeam.geometry);

      // Upper horizontal girder at z = 8.0 m
      const upperBeam = createStrutBetween(ua, ub, 0.11, upperSteelMat, 8);
      addSolidWithWire(upperBeam);
      dynamicDisposables.push(upperBeam.geometry);

      // Diagonal tubular X-bracing between z = 4 m and z = 8 m
      const diag1 = createStrutBetween(la, ub, 0.065, upperSteelMat, 8);
      const diag2 = createStrutBetween(lb, ua, 0.065, upperSteelMat, 8);
      addSolidWithWire(diag1);
      addSolidWithWire(diag2);
      dynamicDisposables.push(diag1.geometry, diag2.geometry);

      // Sub-waterline lower horizontal collar tie at y = 1.65 m
      const tieA = new THREE.Vector3(la.x, 1.65, la.z);
      const tieB = new THREE.Vector3(lb.x, 1.65, lb.z);
      const lowTie = createStrutBetween(tieA, tieB, 0.09, lowerSteelMat, 8);
      addSolidWithWire(lowTie, false);
      dynamicDisposables.push(lowTie.geometry);

      // Safety handrail along lower deck tier (y = lowerY + 0.95)
      const railA = new THREE.Vector3(la.x, lowerY + 0.92, la.z);
      const railB = new THREE.Vector3(lb.x, lowerY + 0.92, lb.z);
      const rail = createStrutBetween(railA, railB, 0.028, safetyYellowMat, 6);
      addSolidWithWire(rail, false);
      dynamicDisposables.push(rail.geometry);
    }

    // Service grating walkway along front lower bay (Pillar 1 -> Pillar 2)
    if (params.layout === 'offshore-frame') {
      const deckGeo = new THREE.BoxGeometry(params.spanX - 0.6, 0.12, params.depthY - 0.6);
      const deckMesh = new THREE.Mesh(deckGeo, catwalkMat);
      deckMesh.position.set(0, lowerY - 0.14, 0);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      addSolidWithWire(deckMesh);
      dynamicDisposables.push(deckGeo);
    } else {
      const deckGeo = new THREE.BoxGeometry(params.spanX - 0.4, 0.12, 1.35);
      const deckMesh = new THREE.Mesh(deckGeo, catwalkMat);
      deckMesh.position.set(0, lowerY - 0.14, 0);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      addSolidWithWire(deckMesh);
      dynamicDisposables.push(deckGeo);
    }

    // Vertical maintenance access ladder on Pillar 1 (front side)
    const p1 = lowerThreePts[0];
    const ladderZ = p1.z + 0.44;
    const railL = createStrutBetween(
      new THREE.Vector3(p1.x - 0.2, 1.35, ladderZ),
      new THREE.Vector3(p1.x - 0.2, upperY, ladderZ),
      0.024,
      safetyYellowMat,
      6,
    );
    const railR = createStrutBetween(
      new THREE.Vector3(p1.x + 0.2, 1.35, ladderZ),
      new THREE.Vector3(p1.x + 0.2, upperY, ladderZ),
      0.024,
      safetyYellowMat,
      6,
    );
    addSolidWithWire(railL, false);
    addSolidWithWire(railR, false);
    dynamicDisposables.push(railL.geometry, railR.geometry);

    const rungCount = Math.floor((upperY - 1.5) / 0.42);
    const rungGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.4, 6);
    rungGeo.rotateZ(Math.PI / 2);
    const rungInstanced = new THREE.InstancedMesh(rungGeo, safetyYellowMat, rungCount);
    for (let r = 0; r < rungCount; r++) {
      boltDummy.position.set(p1.x, 1.65 + r * 0.42, ladderZ);
      boltDummy.rotation.set(0, 0, 0);
      boltDummy.scale.set(1, 1, 1);
      boltDummy.updateMatrix();
      rungInstanced.setMatrixAt(r, boltDummy.matrix);
    }
    rungInstanced.instanceMatrix.needsUpdate = true;
    rungInstanced.computeBoundingSphere();
    solidGroup.add(rungInstanced);
    dynamicDisposables.push(rungGeo);

    // -----------------------------------------------------------------------
    // Scientific Elevation Reference Contour Lines (z = 4.0 m and z = 8.0 m)
    // -----------------------------------------------------------------------
    const padX = params.spanX / 2 + 1.4;
    const padZ = Math.max(params.depthY / 2, 1.5) + 1.4;
    for (const elev of [lowerY, upperY]) {
      const rectPts = [
        new THREE.Vector3(-padX, elev, -padZ),
        new THREE.Vector3(padX, elev, -padZ),
        new THREE.Vector3(padX, elev, padZ),
        new THREE.Vector3(-padX, elev, padZ),
        new THREE.Vector3(-padX, elev, -padZ),
      ];
      const rectGeo = new THREE.BufferGeometry().setFromPoints(rectPts);
      const rectLine = new THREE.Line(rectGeo, tierGuideMat);
      rectLine.computeLineDistances();
      tierGuidesGroup.add(rectLine);
      dynamicDisposables.push(rectGeo);
    }

    // -----------------------------------------------------------------------
    // 8 Semantic Landmark Corner Targets (Exact 3D World Coordinates)
    // -----------------------------------------------------------------------
    const coreGeo = new THREE.SphereGeometry(0.22, 18, 14);
    const ringGeo = new THREE.TorusGeometry(0.36, 0.042, 10, 28);
    const haloGeo = new THREE.TorusGeometry(0.56, 0.045, 10, 32);
    const hitGeo = new THREE.SphereGeometry(0.58, 10, 10);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    dynamicDisposables.push(coreGeo, ringGeo, haloGeo, hitGeo, hitMat);

    for (const lm of landmarks) {
      const tp = worldToThree(lm.worldPos);
      const lmNode = new THREE.Group();
      lmNode.position.set(tp.x, tp.y, tp.z);

      const coreMat = new THREE.MeshStandardMaterial({
        color: lm.colorHex,
        emissive: lm.colorHex,
        emissiveIntensity: 0.25,
        roughness: 0.25,
        metalness: 0.3,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      lmNode.add(coreMesh);

      // Machined metrology target ring around the corner point
      const ringMesh = new THREE.Mesh(ringGeo, bracketMat);
      ringMesh.rotation.x = Math.PI / 2;
      lmNode.add(ringMesh);

      // Selection / Ray-Pair halo ring
      const haloMat = new THREE.MeshBasicMaterial({
        color: lm.colorHex,
        transparent: true,
        opacity: 0.92,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.visible = false;
      lmNode.add(haloMesh);

      // Invisible generous hit-sphere for easy 3D raycast picking
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = {
        pickType: 'landmark',
        landmarkId: lm.id,
      };
      lmNode.add(hitMesh);
      interactables.push(hitMesh);

      landmarkGroup.add(lmNode);

      // 3D floating label sprite anchored cleanly to the real 3D landmark position
      const primary = `ID ${lm.id}`;
      const secondary = `z=${lm.worldPos.z.toFixed(0)}m · G${lm.pairIndex}`;
      const labelTex = createBadgeSpriteTexture(primary, secondary, lm.colorHex, 'landmark', false);
      const labelMat = new THREE.SpriteMaterial({
        map: labelTex,
        depthTest: false,
        transparent: true,
        fog: false,
        toneMapped: false,
      });
      const labelSprite = new THREE.Sprite(labelMat);
      // Slight outward offset so labels never collide with the pylon shaft
      const outX = tp.x === 0 ? 0 : Math.sign(tp.x) * 0.95;
      const outZ = tp.z === 0 ? 0.85 : Math.sign(tp.z) * 0.75;
      labelSprite.position.set(tp.x + outX, tp.y + 0.55, tp.z + outZ);
      labelSprite.scale.set(2.15, 0.84, 1);
      labelSprite.renderOrder = 25;
      labelGroup.add(labelSprite);

      dynamicDisposables.push(coreMat, haloMat, labelTex, labelMat);
      landmarkRecords.push({
        id: lm.id,
        coreMesh,
        haloMesh,
        ringMat: haloMat,
        labelSprite,
        baseColorHex: lm.colorHex,
        labelPrimary: primary,
        labelSecondary: secondary,
      });
    }
  }

  return {
    group: rootGroup,
    get interactables() {
      return interactables;
    },
    rebuild,
    setDisplayState({
      mode,
      showLabels,
      showWireframe,
      selectedLandmarkId,
      pairAId,
      pairBId,
      rayAngleMode,
    }) {
      const isSci = mode === 'scientific';
      wireframeGroup.visible = showWireframe || isSci;
      tierGuidesGroup.visible = isSci;
      labelGroup.visible = showLabels;

      // In Scientific Mode, make solid structure semi-translucent clean technical matte
      // so all 8 landmarks and internal rays are unmistakably legible
      lowerSteelMat.transparent = isSci;
      lowerSteelMat.opacity = isSci ? 0.38 : 1.0;
      upperSteelMat.transparent = isSci;
      upperSteelMat.opacity = isSci ? 0.42 : 1.0;
      concreteMat.transparent = isSci;
      concreteMat.opacity = isSci ? 0.35 : 1.0;
      catwalkMat.transparent = isSci;
      catwalkMat.opacity = isSci ? 0.28 : 1.0;

      for (const fm of foamMeshes) {
        fm.visible = !isSci;
      }

      for (const rec of landmarkRecords) {
        const isPair = rec.id === pairAId || rec.id === pairBId;
        const isSel = rec.id === selectedLandmarkId;
        const active = isSel || (rayAngleMode && isPair);

        rec.haloMesh.visible = active || isPair;
        rec.haloMesh.scale.setScalar(isSel ? 1.25 : 1.0);
        rec.ringMat.color.set(isSel ? '#0f172a' : isPair ? '#f59e0b' : rec.baseColorHex);
        rec.coreMesh.scale.setScalar(active ? 1.32 : isPair ? 1.16 : 1.0);

        // Update badge texture highlight only if state changed
        const wantHighlighted = isSel || (rayAngleMode && isPair);
        if (rec.labelSprite.userData.highlighted !== wantHighlighted) {
          rec.labelSprite.userData.highlighted = wantHighlighted;
          const oldMap = rec.labelSprite.material.map;
          const newTex = createBadgeSpriteTexture(
            rec.labelPrimary,
            rec.labelSecondary,
            wantHighlighted ? '#f59e0b' : rec.baseColorHex,
            'landmark',
            wantHighlighted,
          );
          rec.labelSprite.material.map = newTex;
          rec.labelSprite.material.needsUpdate = true;
          if (oldMap) oldMap.dispose();
          dynamicDisposables.push(newTex);
        }
      }
    },
    dispose() {
      clearDynamic();
      for (const m of permanentMaterials) {
        m.dispose();
      }
    },
  };
}
