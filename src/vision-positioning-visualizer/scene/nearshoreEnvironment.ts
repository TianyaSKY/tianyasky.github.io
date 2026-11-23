import * as THREE from 'three';
import { createBadgeSpriteTexture, type ProceduralTexturePack } from './proceduralTextures';
import type { ViewMode } from '../data/visionPositioningConfig';

export interface NearshoreEnvironmentHandle {
  oceanGroup: THREE.Group;
  coastGroup: THREE.Group;
  skyMesh: THREE.Mesh;
  axesGroup: THREE.Group;
  gridGroup: THREE.Group;
  update: (elapsedSec: number) => void;
  applyModeAndLayers: (
    mode: ViewMode,
    showOceanEnv: boolean,
    showAxes: boolean,
    showGrid: boolean,
    scene: THREE.Scene,
  ) => void;
  dispose: () => void;
}

const REALISTIC_SKY_HORIZON = new THREE.Color('#c8dce9');
const SCIENTIFIC_BG = new THREE.Color('#eef3f8');

/**
 * Builds the procedural coastal marine environment (dynamic PBR ocean via onBeforeCompile,
 * coastal daylight sky dome, subtle distant breakwater/headland horizon) and the
 * calibrated Scientific Mode coordinate axes + elevation reference grid.
 */
export function createNearshoreEnvironment(
  textures: ProceduralTexturePack,
): NearshoreEnvironmentHandle {
  const disposables: Array<{ dispose: () => void }> = [];

  // -------------------------------------------------------------------------
  // 1. Procedural Coastal Sky Dome (Realistic Mode)
  // -------------------------------------------------------------------------
  const skyGeo = new THREE.SphereGeometry(260, 32, 20);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTopColor: { value: new THREE.Color('#3b73a8') },
      uMidColor: { value: new THREE.Color('#8ab6d8') },
      uHorizonColor: { value: REALISTIC_SKY_HORIZON.clone() },
      uSunDir: { value: new THREE.Vector3(0.55, 0.42, 0.72).normalize() },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 uTopColor;
      uniform vec3 uMidColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunDir;
      varying vec3 vWorldPos;
      void main() {
        vec3 dir = normalize(vWorldPos);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 col = mix(uHorizonColor, uMidColor, smoothstep(0.0, 0.28, h));
        col = mix(col, uTopColor, smoothstep(0.22, 0.82, h));
        // Soft natural solar halo
        float sunDot = max(dot(dir, uSunDir), 0.0);
        col += vec3(1.0, 0.95, 0.84) * pow(sunDot, 28.0) * 0.28;
        col += vec3(1.0, 0.98, 0.92) * pow(sunDot, 240.0) * 0.45;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  skyMesh.renderOrder = -10;
  disposables.push(skyGeo, skyMat);

  // -------------------------------------------------------------------------
  // 2. Dynamic Nearshore Ocean Surface (PBR MeshStandardMaterial + onBeforeCompile)
  // -------------------------------------------------------------------------
  const oceanGroup = new THREE.Group();
  oceanGroup.name = 'NearshoreOcean';

  const oceanGeo = new THREE.PlaneGeometry(360, 360, 72, 72);
  oceanGeo.rotateX(-Math.PI / 2);

  const oceanUniforms = {
    uTime: { value: 0 },
  };

  const oceanMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0f3d5c'),
    roughness: 0.3,
    metalness: 0.08,
    envMapIntensity: 0.45,
  });

  oceanMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = oceanUniforms.uTime;
    shader.vertexShader =
      `uniform float uTime;\nvarying float vWaveHeight;\nvarying vec2 vOceanXZ;\n` +
      shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      #include <beginnormal_vertex>
      vec2 wPos = position.xz;
      float w1 = sin(wPos.x * 0.21 + uTime * 1.05 + wPos.y * 0.14);
      float w2 = cos(wPos.x * 0.13 - uTime * 0.78 + wPos.y * 0.27);
      float w3 = sin((wPos.x + wPos.y) * 0.42 + uTime * 1.45);
      // Approximate analytical derivatives for dynamic PBR sun glints
      float dHx = 0.13 * 0.21 * cos(wPos.x * 0.21 + uTime * 1.05 + wPos.y * 0.14)
                - 0.09 * 0.13 * sin(wPos.x * 0.13 - uTime * 0.78 + wPos.y * 0.27)
                + 0.04 * 0.42 * cos((wPos.x + wPos.y) * 0.42 + uTime * 1.45);
      float dHz = 0.13 * 0.14 * cos(wPos.x * 0.21 + uTime * 1.05 + wPos.y * 0.14)
                - 0.09 * 0.27 * sin(wPos.x * 0.13 - uTime * 0.78 + wPos.y * 0.27)
                + 0.04 * 0.42 * cos((wPos.x + wPos.y) * 0.42 + uTime * 1.45);
      objectNormal = normalize(vec3(-dHx * 1.8, 1.0, -dHz * 1.8));
      `,
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float hWave = w1 * 0.13 + w2 * 0.09 + w3 * 0.04;
      transformed.y += hWave;
      vWaveHeight = hWave;
      vOceanXZ = position.xz;
      `,
    );

    shader.fragmentShader =
      `varying float vWaveHeight;\nvarying vec2 vOceanXZ;\n` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      // Subtle shallow-to-deep coastal teal/navy gradient + crest sheen
      float distFromOrigin = length(vOceanXZ);
      float depthFactor = smoothstep(8.0, 95.0, distFromOrigin);
      vec3 shallowColor = vec3(0.05, 0.24, 0.35);
      vec3 deepColor = vec3(0.025, 0.13, 0.24);
      vec3 crestTint = vec3(0.18, 0.40, 0.52);
      vec3 baseSea = mix(shallowColor, deepColor, depthFactor);
      float crest = smoothstep(0.05, 0.24, vWaveHeight);
      diffuseColor.rgb = mix(baseSea, crestTint, crest * 0.48);
      `,
    );
  };

  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  oceanMesh.receiveShadow = true;
  oceanGroup.add(oceanMesh);
  disposables.push(oceanGeo, oceanMat);

  // Subtle submerged seabed plane to prevent any void peeking under semi-transparent angles
  const seabedGeo = new THREE.PlaneGeometry(360, 360);
  seabedGeo.rotateX(-Math.PI / 2);
  const seabedMat = new THREE.MeshStandardMaterial({
    color: '#0c2330',
    roughness: 0.95,
    metalness: 0.0,
  });
  const seabedMesh = new THREE.Mesh(seabedGeo, seabedMat);
  seabedMesh.position.y = -3.4;
  oceanGroup.add(seabedMesh);
  disposables.push(seabedGeo, seabedMat);

  // -------------------------------------------------------------------------
  // 3. Distant Schematic Nearshore Breakwater & Coastal Horizon (Realistic Mode)
  // -------------------------------------------------------------------------
  const coastGroup = new THREE.Group();
  coastGroup.name = 'SchematicCoastline';

  // Concrete breakwater seawall in background (+Y world = -Z Three.js)
  const breakwaterMat = new THREE.MeshStandardMaterial({
    color: '#7e868d',
    roughness: 0.88,
    metalness: 0.05,
    bumpMap: textures.concreteBump,
    bumpScale: 0.12,
  });
  const wallGeo = new THREE.BoxGeometry(110, 2.8, 6.5);
  const wallMesh = new THREE.Mesh(wallGeo, breakwaterMat);
  wallMesh.position.set(12, 0.7, -58);
  wallMesh.rotation.y = 0.08;
  wallMesh.receiveShadow = true;
  coastGroup.add(wallMesh);
  disposables.push(wallGeo, breakwaterMat);

  // Breakwater concrete parapet cap
  const capGeo = new THREE.BoxGeometry(110.6, 0.55, 7.1);
  const capMat = new THREE.MeshStandardMaterial({
    color: '#9aa3aa',
    roughness: 0.78,
    metalness: 0.04,
  });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.set(12, 2.25, -58);
  capMesh.rotation.y = 0.08;
  coastGroup.add(capMesh);
  disposables.push(capGeo, capMat);

  // Distant low coastal headland ridge (muted blue-grey so research structure stays hero)
  const headlandMat = new THREE.MeshStandardMaterial({
    color: '#6b7e8c',
    roughness: 0.94,
    metalness: 0.02,
  });
  const ridgeConfigs = [
    { x: -68, z: -124, rx: 52, ry: 9.5, rz: 24 },
    { x: 16, z: -136, rx: 72, ry: 11.5, rz: 28 },
    { x: 102, z: -118, rx: 56, ry: 8.5, rz: 24 },
  ];
  const hillBaseGeo = new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  for (const rc of ridgeConfigs) {
    const hill = new THREE.Mesh(hillBaseGeo, headlandMat);
    hill.position.set(rc.x, -0.4, rc.z);
    hill.scale.set(rc.rx, rc.ry, rc.rz);
    coastGroup.add(hill);
  }
  disposables.push(hillBaseGeo, headlandMat);

  // Harbor navigation lighthouse beacon at west tip of breakwater (composite 3-part silhouette)
  const beaconGroup = new THREE.Group();
  beaconGroup.position.set(-41, 2.4, -54.2);
  const beaconBaseGeo = new THREE.CylinderGeometry(1.1, 1.35, 3.8, 12);
  const beaconBaseMat = new THREE.MeshStandardMaterial({
    color: '#d8dde2',
    roughness: 0.65,
    metalness: 0.1,
  });
  const beaconBase = new THREE.Mesh(beaconBaseGeo, beaconBaseMat);
  beaconBase.position.y = 1.9;
  beaconGroup.add(beaconBase);

  const beaconBandGeo = new THREE.CylinderGeometry(1.14, 1.18, 1.2, 12);
  const beaconBandMat = new THREE.MeshStandardMaterial({
    color: '#b83c32',
    roughness: 0.52,
    metalness: 0.12,
  });
  const beaconBand = new THREE.Mesh(beaconBandGeo, beaconBandMat);
  beaconBand.position.y = 3.2;
  beaconGroup.add(beaconBand);

  const beaconLanternGeo = new THREE.CylinderGeometry(0.65, 0.72, 1.1, 10);
  const beaconLanternMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.3,
    metalness: 0.7,
  });
  const beaconLantern = new THREE.Mesh(beaconLanternGeo, beaconLanternMat);
  beaconLantern.position.y = 4.35;
  beaconGroup.add(beaconLantern);
  coastGroup.add(beaconGroup);
  disposables.push(
    beaconBaseGeo,
    beaconBaseMat,
    beaconBandGeo,
    beaconBandMat,
    beaconLanternGeo,
    beaconLanternMat,
  );

  // Instanced breakwater armor rocks along seawall toe (36 varied boulders)
  const rockGeo = new THREE.DodecahedronGeometry(1.15, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: '#6b7278',
    roughness: 0.92,
    metalness: 0.04,
  });
  const rockCount = 36;
  const rockInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
  const dummy = new THREE.Object3D();
  const colorTmp = new THREE.Color();
  for (let i = 0; i < rockCount; i++) {
    const t = i / (rockCount - 1);
    const rx = -40 + t * 104 + Math.sin(i * 3.1) * 1.4;
    const rz = -53.8 - (rx - 12) * 0.08 + Math.cos(i * 2.3) * 1.1;
    dummy.position.set(rx, 0.25 + (i % 3) * 0.15, rz);
    dummy.rotation.set(i * 0.7, i * 1.1, i * 0.4);
    const s = 0.8 + ((i * 19) % 10) * 0.07;
    dummy.scale.set(s * 1.25, s * 0.78, s);
    dummy.updateMatrix();
    rockInstanced.setMatrixAt(i, dummy.matrix);
    colorTmp.setHSL(0.58, 0.05, 0.38 + ((i * 13) % 7) * 0.025);
    rockInstanced.setColorAt(i, colorTmp);
  }
  rockInstanced.instanceMatrix.needsUpdate = true;
  if (rockInstanced.instanceColor) rockInstanced.instanceColor.needsUpdate = true;
  rockInstanced.computeBoundingSphere();
  coastGroup.add(rockInstanced);
  disposables.push(rockGeo, rockMat);

  // -------------------------------------------------------------------------
  // 4. World Coordinate Axes (Z-up World mapped to Three.js Y-up)
  //    +X_world (Red)   -> Three.js +X (1, 0, 0)
  //    +Y_world (Green) -> Three.js -Z (0, 0, -1)
  //    +Z_world (Blue)  -> Three.js +Y (0, 1, 0)
  // -------------------------------------------------------------------------
  const axesGroup = new THREE.Group();
  axesGroup.name = 'WorldCoordinateAxes';
  const axisLength = 10.5;
  const axisOrigin = new THREE.Vector3(0, 0.05, 0);

  const axisDefs: Array<{ dir: THREE.Vector3; hex: string; label: string }> = [
    { dir: new THREE.Vector3(1, 0, 0), hex: '#dc2626', label: '+X' },
    { dir: new THREE.Vector3(0, 0, -1), hex: '#16a34a', label: '+Y' },
    { dir: new THREE.Vector3(0, 1, 0), hex: '#2563eb', label: '+Z' },
  ];

  for (const ax of axisDefs) {
    const arrow = new THREE.ArrowHelper(
      ax.dir,
      axisOrigin,
      axisLength,
      new THREE.Color(ax.hex).getHex(),
      0.85,
      0.42,
    );
    axesGroup.add(arrow);

    const spriteTex = createBadgeSpriteTexture(ax.label, null, ax.hex, 'axis');
    const spriteMat = new THREE.SpriteMaterial({
      map: spriteTex,
      depthTest: false,
      transparent: true,
      fog: false,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(axisOrigin).addScaledVector(ax.dir, axisLength + 0.95);
    sprite.scale.set(1.25, 1.25, 1);
    sprite.renderOrder = 20;
    axesGroup.add(sprite);
    disposables.push(spriteTex, spriteMat);
  }

  // -------------------------------------------------------------------------
  // 5. Calibrated Metrology Ground Grid (Z_world = 0 plane)
  // -------------------------------------------------------------------------
  const gridGroup = new THREE.Group();
  gridGroup.name = 'GroundReferenceGrid';

  const mainGrid = new THREE.GridHelper(60, 30, 0x64748b, 0xcbd5e1);
  mainGrid.position.y = 0.03;
  const gridMats = Array.isArray(mainGrid.material) ? mainGrid.material : [mainGrid.material];
  for (const m of gridMats) {
    m.polygonOffset = true;
    m.polygonOffsetFactor = -1;
    m.polygonOffsetUnits = -1;
    m.transparent = true;
    m.opacity = 0.72;
  }
  gridGroup.add(mainGrid);
  disposables.push(mainGrid.geometry, ...gridMats);

  // Subtle scientific ground matte plane beneath grid so Scientific Mode has grounded contrast
  const sciFloorGeo = new THREE.PlaneGeometry(140, 140);
  sciFloorGeo.rotateX(-Math.PI / 2);
  const sciFloorMat = new THREE.MeshStandardMaterial({
    color: '#e5ecf4',
    roughness: 0.94,
    metalness: 0.0,
    transparent: true,
    opacity: 0.92,
  });
  const sciFloor = new THREE.Mesh(sciFloorGeo, sciFloorMat);
  sciFloor.position.y = 0.0;
  sciFloor.receiveShadow = true;
  gridGroup.add(sciFloor);
  disposables.push(sciFloorGeo, sciFloorMat);

  return {
    oceanGroup,
    coastGroup,
    skyMesh,
    axesGroup,
    gridGroup,
    update(elapsedSec: number) {
      oceanUniforms.uTime.value = elapsedSec;
    },
    applyModeAndLayers(mode, showOceanEnv, showAxes, showGrid, scene) {
      const realisticEnvVisible = mode === 'realistic' && showOceanEnv;
      oceanGroup.visible = realisticEnvVisible;
      coastGroup.visible = realisticEnvVisible;
      skyMesh.visible = realisticEnvVisible;

      axesGroup.visible = showAxes;
      gridGroup.visible = showGrid || !realisticEnvVisible;
      sciFloor.visible = !realisticEnvVisible;

      if (realisticEnvVisible) {
        scene.background = REALISTIC_SKY_HORIZON;
        scene.fog = new THREE.FogExp2(REALISTIC_SKY_HORIZON.getHex(), 0.0052);
      } else {
        scene.background = SCIENTIFIC_BG;
        scene.fog = new THREE.FogExp2(SCIENTIFIC_BG.getHex(), 0.0042);
      }
    },
    dispose() {
      for (const d of disposables) {
        d.dispose();
      }
    },
  };
}
