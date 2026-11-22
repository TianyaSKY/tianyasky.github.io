import * as THREE from 'three';

export interface RaceCarRig {
  root: THREE.Group;
  frontLeftPivot: THREE.Group;
  frontRightPivot: THREE.Group;
  wheelMeshes: THREE.Object3D[];
  brakeLightMat: THREE.MeshStandardMaterial;
  lidarOriginLocal: THREE.Vector3;
  frontRightTireLocal: THREE.Vector3;
  rearRightTireLocal: THREE.Vector3;
  dispose: () => void;
}

/**
 * Builds a composite 12-part procedural 3D GT/Formula-inspired autonomous race car.
 * Local coordinate convention matching RacingCar:
 *   +Z = forward nose, +Y = up, +X = left/right symmetric, bottom flush at y = 0.
 */
export function buildRaceCar(
  tireBumpMap: THREE.Texture,
  contactShadowMap: THREE.Texture,
): RaceCarRig {
  const root = new THREE.Group();
  root.name = 'RLRaceCar';

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

  // Materials with clear roughness/metalness contrast (>= 0.25 separation between adjacent parts)
  const bodyPaintMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc81e1e, // Motorsport crimson matching COLOR_CAR_BODY (1.0, 0.2, 0.2)
      metalness: 0.26,
      roughness: 0.34,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
    }),
  );

  const carbonMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1d2129,
      metalness: 0.25,
      roughness: 0.72,
    }),
  );

  const canopyGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x18253d, // Matching COLOR_CAR_WINDOW (0.2, 0.2, 0.5) darkened to realistic tinted glass
      metalness: 0.15,
      roughness: 0.10,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
    }),
  );

  const tireRubberMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x191c22,
      metalness: 0.05,
      roughness: 0.88,
      bumpMap: tireBumpMap,
      bumpScale: 0.04,
    }),
  );

  const alloyRimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4dbe5,
      metalness: 0.9,
      roughness: 0.2,
    }),
  );

  const caliperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.3,
      roughness: 0.35,
    }),
  );

  const chromeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.14,
    }),
  );

  const headlightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0xe0f2fe,
      emissiveIntensity: 1.4,
      roughness: 0.15,
    }),
  );

  const brakeLightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    }),
  );

  const lidarLensMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      metalness: 0.5,
      roughness: 0.15,
    }),
  );

  // 1. Soft radial contact shadow directly beneath the vehicle
  const shadowPlane = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(3.4, 5.8)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: contactShadowMap,
        transparent: true,
        depthWrite: false,
        opacity: 0.55,
      }),
    ),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.018;
  root.add(shadowPlane);

  // 2. Sculpted main monocoque chassis (ExtrudeGeometry side profile rotated into XZ)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2.1, 0.24);  // Rear lower edge
  bodyShape.lineTo(2.15, 0.20);  // Front nose lower edge
  bodyShape.lineTo(2.26, 0.42);  // Front nose tip
  bodyShape.lineTo(1.75, 0.64);  // Front hood slope
  bodyShape.lineTo(0.85, 0.74);  // Base of windshield
  bodyShape.lineTo(0.15, 1.14);  // Roof front peak
  bodyShape.lineTo(-0.85, 1.12); // Roof rear slope
  bodyShape.lineTo(-1.55, 0.80); // Engine deck
  bodyShape.lineTo(-2.12, 0.76); // Rear deck tail
  bodyShape.lineTo(-2.16, 0.36); // Rear diffuser lip
  bodyShape.closePath();

  const bodyExtrude = trackGeo(
    new THREE.ExtrudeGeometry(bodyShape, {
      depth: 1.72,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.09,
      bevelSegments: 3,
    }),
  );
  // Center extrusion along Z (which becomes X after Y rotation)
  bodyExtrude.translate(0, 0, -0.86);
  // Rotate so shape's +X becomes vehicle's +Z (forward)
  bodyExtrude.rotateY(-Math.PI / 2);

  const mainHull = new THREE.Mesh(bodyExtrude, bodyPaintMat);
  mainHull.castShadow = true;
  mainHull.receiveShadow = true;
  root.add(mainHull);

  // 3. Recessed dark carbon front radiator grille & hood vent
  const frontGrille = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.18, 0.16, 0.12)), carbonMat);
  frontGrille.position.set(0, 0.34, 2.27);
  root.add(frontGrille);

  const hoodVent = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.68, 0.03, 0.48)), carbonMat);
  hoodVent.position.set(0, 0.72, 1.32);
  hoodVent.rotation.x = 0.14;
  root.add(hoodVent);

  // 4. Carbon underbody floorpan + front splitter + rear diffuser
  const floorpan = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.06, 0.12, 4.35)), carbonMat);
  floorpan.position.set(0, 0.20, 0.02);
  floorpan.castShadow = true;
  root.add(floorpan);

  const frontSplitter = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.22, 0.06, 0.68)), carbonMat);
  frontSplitter.position.set(0, 0.16, 2.08);
  frontSplitter.castShadow = true;
  root.add(frontSplitter);

  const rearDiffuser = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.76, 0.22, 0.44)), carbonMat);
  rearDiffuser.position.set(0, 0.24, -2.06);
  root.add(rearDiffuser);

  // 5. Sculpted side pods (left & right aerodynamic intake skirts)
  const podGeo = trackGeo(new THREE.BoxGeometry(0.28, 0.36, 2.15));
  for (const side of [-1, 1]) {
    const pod = new THREE.Mesh(podGeo, bodyPaintMat);
    pod.position.set(side * 1.0, 0.44, -0.05);
    pod.castShadow = true;
    root.add(pod);

    const intake = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.24, 0.12)), carbonMat);
    intake.position.set(side * 1.0, 0.45, 1.03);
    root.add(intake);
  }

  // 6. Tinted cockpit canopy & side windows
  const canopyShape = new THREE.Shape();
  canopyShape.moveTo(-0.92, 0.74);
  canopyShape.lineTo(0.82, 0.74);
  canopyShape.lineTo(0.18, 1.19);
  canopyShape.lineTo(-0.74, 1.17);
  canopyShape.closePath();

  const canopyGeo = trackGeo(
    new THREE.ExtrudeGeometry(canopyShape, {
      depth: 1.24,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 2,
    }),
  );
  canopyGeo.translate(0, 0, -0.62);
  canopyGeo.rotateY(-Math.PI / 2);

  const canopy = new THREE.Mesh(canopyGeo, canopyGlassMat);
  canopy.position.y = 0.02;
  canopy.castShadow = true;
  root.add(canopy);

  // 7. Rear GT wing assembly (2 pylons + airfoil blade + 2 endplates)
  const wingGroup = new THREE.Group();
  const pylonGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.48, 0.28));
  for (const side of [-0.56, 0.56]) {
    const pylon = new THREE.Mesh(pylonGeo, carbonMat);
    pylon.position.set(side, 0.96, -1.98);
    pylon.rotation.x = -0.18;
    pylon.castShadow = true;
    wingGroup.add(pylon);
  }
  const wingBlade = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.18, 0.07, 0.44)), carbonMat);
  wingBlade.position.set(0, 1.20, -2.06);
  wingBlade.rotation.x = 0.14;
  wingBlade.castShadow = true;
  wingGroup.add(wingBlade);

  const endplateGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.34, 0.56));
  for (const side of [-1.09, 1.09]) {
    const ep = new THREE.Mesh(endplateGeo, bodyPaintMat);
    ep.position.set(side, 1.18, -2.05);
    wingGroup.add(ep);
  }
  root.add(wingGroup);

  // 8. Twin metallic exhaust tips
  const exhaustGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.09, 0.26, 16));
  exhaustGeo.rotateX(Math.PI / 2);
  for (const side of [-0.32, 0.32]) {
    const pipe = new THREE.Mesh(exhaustGeo, chromeMat);
    pipe.position.set(side, 0.28, -2.24);
    root.add(pipe);
  }

  // 9. Headlights & rear brake light bar
  const headGeo = trackGeo(new THREE.BoxGeometry(0.42, 0.11, 0.16));
  for (const side of [-0.66, 0.66]) {
    const hl = new THREE.Mesh(headGeo, headlightMat);
    hl.position.set(side, 0.50, 2.15);
    hl.rotation.y = side * 0.18;
    root.add(hl);
  }
  const brakeBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.54, 0.09, 0.08)), brakeLightMat);
  brakeBar.position.set(0, 0.66, -2.18);
  root.add(brakeBar);

  // 10. Roof-mounted LiDAR sensor turret (physical origin of the 9-ray fan)
  const lidarGroup = new THREE.Group();
  lidarGroup.position.set(0, 1.26, -0.15);
  const lidarBase = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.20, 0.24, 0.08, 20)), carbonMat);
  lidarGroup.add(lidarBase);
  const lidarRing = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.13, 24)), lidarLensMat);
  lidarRing.position.y = 0.10;
  lidarGroup.add(lidarRing);
  const lidarCap = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.17, 0.19, 0.05, 20)), chromeMat);
  lidarCap.position.y = 0.18;
  lidarGroup.add(lidarCap);
  root.add(lidarGroup);

  // 11. Four multi-part articulated wheels (tire + alloy rim + 5 spokes + brake disc + caliper)
  const tireRadius = 0.40;
  const tireWidth = 0.34;
  const tireGeo = trackGeo(new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 28));
  tireGeo.rotateZ(Math.PI / 2);

  const rimGeo = trackGeo(new THREE.CylinderGeometry(0.26, 0.26, tireWidth + 0.02, 20));
  rimGeo.rotateZ(Math.PI / 2);

  const hubGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.08, tireWidth + 0.05, 14));
  hubGeo.rotateZ(Math.PI / 2);

  const spokeGeo = trackGeo(new THREE.BoxGeometry(tireWidth + 0.03, 0.44, 0.045));
  const caliperGeo = trackGeo(new THREE.BoxGeometry(0.12, 0.20, 0.14));

  const wheelMeshes: THREE.Object3D[] = [];
  const frontLeftPivot = new THREE.Group();
  const frontRightPivot = new THREE.Group();

  const wheelPositions: Array<{
    x: number;
    z: number;
    isFront: boolean;
    side: -1 | 1;
  }> = [
    { x: 1.06, z: 1.38, isFront: true, side: 1 },   // Front Left (+X in +Z forward)
    { x: -1.06, z: 1.38, isFront: true, side: -1 }, // Front Right (-X in +Z forward)
    { x: 1.08, z: -1.32, isFront: false, side: 1 }, // Rear Left
    { x: -1.08, z: -1.32, isFront: false, side: -1 }, // Rear Right
  ];

  for (const wp of wheelPositions) {
    const pivot = wp.isFront ? (wp.side > 0 ? frontLeftPivot : frontRightPivot) : new THREE.Group();
    pivot.position.set(wp.x, tireRadius, wp.z);

    const spinGroup = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, tireRubberMat);
    tire.castShadow = true;
    tire.receiveShadow = true;
    spinGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, alloyRimMat);
    spinGroup.add(rim);

    const hub = new THREE.Mesh(hubGeo, chromeMat);
    spinGroup.add(hub);

    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(spokeGeo, carbonMat);
      spoke.rotation.x = (s / 5) * Math.PI;
      spinGroup.add(spoke);
    }

    // Static brake caliper attached to pivot (doesn't spin with tire)
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(-wp.side * 0.05, 0.08, -0.14);
    pivot.add(caliper);

    pivot.add(spinGroup);
    root.add(pivot);
    wheelMeshes.push(spinGroup);
  }

  return {
    root,
    frontLeftPivot,
    frontRightPivot,
    wheelMeshes,
    brakeLightMat,
    lidarOriginLocal: new THREE.Vector3(0, 1.36, -0.15),
    frontRightTireLocal: new THREE.Vector3(-1.06, tireRadius, 1.38),
    rearRightTireLocal: new THREE.Vector3(-1.08, tireRadius, -1.32),
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
