import * as THREE from 'three';

export interface ProceduralTexturePack {
  asphaltMap: THREE.CanvasTexture;
  asphaltBump: THREE.CanvasTexture;
  grassMap: THREE.CanvasTexture;
  tireBump: THREE.CanvasTexture;
  obstacleHazardMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

function createDeterministicRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createProceduralTextures(maxAnisotropy: number, darkMode: boolean): ProceduralTexturePack {
  const rng = createDeterministicRng(202604);

  // 1. Asphalt micro-grain albedo + bump
  const asphaltCanvas = document.createElement('canvas');
  asphaltCanvas.width = 512;
  asphaltCanvas.height = 512;
  const aCtx = asphaltCanvas.getContext('2d')!;
  aCtx.fillStyle = darkMode ? '#22262e' : '#313742';
  aCtx.fillRect(0, 0, 512, 512);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 14000; i++) {
    const x = Math.floor(rng() * 512);
    const y = Math.floor(rng() * 512);
    const sz = rng() > 0.7 ? 2 : 1;
    const v = Math.floor(34 + rng() * 34);
    aCtx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    aCtx.fillRect(x, y, sz, sz);

    const bv = Math.floor(90 + rng() * 80);
    bCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
    bCtx.fillRect(x, y, sz, sz);
  }
  // Subtle tire-wear tracks along the road UV
  aCtx.fillStyle = 'rgba(15, 18, 24, 0.14)';
  aCtx.fillRect(110, 0, 68, 512);
  aCtx.fillRect(334, 0, 68, 512);

  const asphaltMap = new THREE.CanvasTexture(asphaltCanvas);
  asphaltMap.colorSpace = THREE.SRGBColorSpace;
  asphaltMap.wrapS = THREE.RepeatWrapping;
  asphaltMap.wrapT = THREE.RepeatWrapping;
  asphaltMap.anisotropy = maxAnisotropy;

  const asphaltBump = new THREE.CanvasTexture(bumpCanvas);
  asphaltBump.wrapS = THREE.RepeatWrapping;
  asphaltBump.wrapT = THREE.RepeatWrapping;
  asphaltBump.anisotropy = maxAnisotropy;

  // 2. Checkerboard meadow grass matching RacingCar's COLOR_GROUND_LIGHT / DARK
  const grassCanvas = document.createElement('canvas');
  grassCanvas.width = 512;
  grassCanvas.height = 512;
  const gCtx = grassCanvas.getContext('2d')!;
  const lightGrass = darkMode ? '#1e3528' : '#7ba676';
  const darkGrass = darkMode ? '#182b21' : '#6c9868';
  const tile = 128;
  for (let gx = 0; gx < 4; gx++) {
    for (let gy = 0; gy < 4; gy++) {
      gCtx.fillStyle = (gx + gy) % 2 === 0 ? lightGrass : darkGrass;
      gCtx.fillRect(gx * tile, gy * tile, tile, tile);
    }
  }
  // Fine subtle grass grain
  for (let i = 0; i < 6000; i++) {
    const x = rng() * 512;
    const y = rng() * 512;
    gCtx.fillStyle = rng() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    gCtx.fillRect(x, y, 2, 3);
  }
  const grassMap = new THREE.CanvasTexture(grassCanvas);
  grassMap.colorSpace = THREE.SRGBColorSpace;
  grassMap.wrapS = THREE.RepeatWrapping;
  grassMap.wrapT = THREE.RepeatWrapping;
  grassMap.repeat.set(60, 60);
  grassMap.anisotropy = maxAnisotropy;

  // 3. Tire tread bump map
  const tireCanvas = document.createElement('canvas');
  tireCanvas.width = 256;
  tireCanvas.height = 256;
  const tCtx = tireCanvas.getContext('2d')!;
  tCtx.fillStyle = '#909090';
  tCtx.fillRect(0, 0, 256, 256);
  tCtx.fillStyle = '#303030';
  for (let y = 0; y < 256; y += 16) {
    tCtx.fillRect(28, y, 64, 6);
    tCtx.fillRect(164, y + 8, 64, 6);
    tCtx.fillRect(118, y, 20, 12);
  }
  const tireBump = new THREE.CanvasTexture(tireCanvas);
  tireBump.wrapS = THREE.RepeatWrapping;
  tireBump.wrapT = THREE.RepeatWrapping;
  tireBump.repeat.set(1, 4);
  tireBump.anisotropy = maxAnisotropy;

  // 4. Golden-amber hazard obstacle texture (matching COLOR_OBSTACLE_BODY 0.8, 0.6, 0.1)
  const obsCanvas = document.createElement('canvas');
  obsCanvas.width = 256;
  obsCanvas.height = 256;
  const oCtx = obsCanvas.getContext('2d')!;
  oCtx.fillStyle = '#d49b1a';
  oCtx.fillRect(0, 0, 256, 256);
  // Subtle metallic industrial ribs + diagonal warning stripe band at bottom
  oCtx.fillStyle = 'rgba(255,255,255,0.12)';
  oCtx.fillRect(0, 14, 256, 12);
  oCtx.fillStyle = 'rgba(30,24,10,0.18)';
  oCtx.fillRect(0, 194, 256, 48);
  oCtx.save();
  oCtx.beginPath();
  oCtx.rect(0, 198, 256, 40);
  oCtx.clip();
  oCtx.fillStyle = '#1f2329';
  for (let x = -64; x < 320; x += 36) {
    oCtx.beginPath();
    oCtx.moveTo(x, 240);
    oCtx.lineTo(x + 18, 240);
    oCtx.lineTo(x + 38, 194);
    oCtx.lineTo(x + 20, 194);
    oCtx.closePath();
    oCtx.fill();
  }
  oCtx.restore();
  const obstacleHazardMap = new THREE.CanvasTexture(obsCanvas);
  obstacleHazardMap.colorSpace = THREE.SRGBColorSpace;
  obstacleHazardMap.anisotropy = maxAnisotropy;

  // 5. Soft radial contact shadow texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(128, 128, 18, 128, 128, 122);
  grad.addColorStop(0, 'rgba(8, 12, 20, 0.68)');
  grad.addColorStop(0.55, 'rgba(8, 12, 20, 0.34)');
  grad.addColorStop(1, 'rgba(8, 12, 20, 0.0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 256, 256);
  const contactShadowMap = new THREE.CanvasTexture(shadowCanvas);

  return {
    asphaltMap,
    asphaltBump,
    grassMap,
    tireBump,
    obstacleHazardMap,
    contactShadowMap,
    dispose: () => {
      asphaltMap.dispose();
      asphaltBump.dispose();
      grassMap.dispose();
      tireBump.dispose();
      obstacleHazardMap.dispose();
      contactShadowMap.dispose();
    },
  };
}
