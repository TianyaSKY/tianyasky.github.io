import * as THREE from 'three';

export interface ProceduralTexturePack {
  steelBump: THREE.CanvasTexture;
  steelRoughness: THREE.CanvasTexture;
  concreteBump: THREE.CanvasTexture;
  foamRing: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Deterministic pseudo-random helper so procedural textures look identical across sessions.
 */
function seededNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

/**
 * Generates zero-dependency procedural PBR surface textures (bump, roughness, waterline foam).
 */
export function createProceduralTextures(maxAnisotropy: number): ProceduralTexturePack {
  // 1. Brushed & lightly weathered marine steel bump + roughness maps
  const steelSize = 256;
  const steelBumpCanvas = document.createElement('canvas');
  steelBumpCanvas.width = steelSize;
  steelBumpCanvas.height = steelSize;
  const sbCtx = steelBumpCanvas.getContext('2d')!;

  const steelRoughCanvas = document.createElement('canvas');
  steelRoughCanvas.width = steelSize;
  steelRoughCanvas.height = steelSize;
  const srCtx = steelRoughCanvas.getContext('2d')!;

  sbCtx.fillStyle = '#808080';
  sbCtx.fillRect(0, 0, steelSize, steelSize);
  srCtx.fillStyle = '#707070';
  srCtx.fillRect(0, 0, steelSize, steelSize);

  // Subtle horizontal weld seams and vertical brushed grain
  for (let i = 0; i < 600; i++) {
    const x = seededNoise(i, 1, 11) * steelSize;
    const y = seededNoise(i, 2, 11) * steelSize;
    const h = 14 + seededNoise(i, 3, 11) * 42;
    const v = 110 + Math.floor(seededNoise(i, 4, 11) * 38);
    sbCtx.fillStyle = `rgb(${v},${v},${v})`;
    sbCtx.fillRect(x, y, 1.5, h);

    const rv = 92 + Math.floor(seededNoise(i, 5, 19) * 58);
    srCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
    srCtx.fillRect(x, y, 2, h);
  }
  // Subtle industrial panel seam
  sbCtx.fillStyle = '#5a5a5a';
  sbCtx.fillRect(0, 126, steelSize, 3);
  sbCtx.fillStyle = '#a4a4a4';
  sbCtx.fillRect(0, 129, steelSize, 2);

  const steelBump = new THREE.CanvasTexture(steelBumpCanvas);
  steelBump.wrapS = THREE.RepeatWrapping;
  steelBump.wrapT = THREE.RepeatWrapping;
  steelBump.repeat.set(2, 4);
  steelBump.anisotropy = maxAnisotropy;

  const steelRoughness = new THREE.CanvasTexture(steelRoughCanvas);
  steelRoughness.wrapS = THREE.RepeatWrapping;
  steelRoughness.wrapT = THREE.RepeatWrapping;
  steelRoughness.repeat.set(2, 4);
  steelRoughness.anisotropy = maxAnisotropy;

  // 2. Weathered marine concrete bump map
  const concSize = 256;
  const concCanvas = document.createElement('canvas');
  concCanvas.width = concSize;
  concCanvas.height = concSize;
  const cCtx = concCanvas.getContext('2d')!;
  cCtx.fillStyle = '#808080';
  cCtx.fillRect(0, 0, concSize, concSize);

  for (let i = 0; i < 2400; i++) {
    const x = seededNoise(i, 1, 41) * concSize;
    const y = seededNoise(i, 2, 41) * concSize;
    const r = 1 + seededNoise(i, 3, 41) * 3.5;
    const shade = 75 + Math.floor(seededNoise(i, 4, 41) * 105);
    cCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
    cCtx.beginPath();
    cCtx.arc(x, y, r, 0, Math.PI * 2);
    cCtx.fill();
  }
  const concreteBump = new THREE.CanvasTexture(concCanvas);
  concreteBump.wrapS = THREE.RepeatWrapping;
  concreteBump.wrapT = THREE.RepeatWrapping;
  concreteBump.repeat.set(2, 2);
  concreteBump.anisotropy = maxAnisotropy;

  // 3. Soft radial waterline foam / contact ring texture
  const foamSize = 256;
  const foamCanvas = document.createElement('canvas');
  foamCanvas.width = foamSize;
  foamCanvas.height = foamSize;
  const fCtx = foamCanvas.getContext('2d')!;
  fCtx.clearRect(0, 0, foamSize, foamSize);

  const cx = foamSize / 2;
  const grad = fCtx.createRadialGradient(cx, cx, foamSize * 0.16, cx, cx, foamSize * 0.48);
  grad.addColorStop(0.0, 'rgba(225, 242, 252, 0.0)');
  grad.addColorStop(0.28, 'rgba(235, 248, 255, 0.52)');
  grad.addColorStop(0.55, 'rgba(215, 238, 250, 0.24)');
  grad.addColorStop(1.0, 'rgba(200, 230, 246, 0.0)');
  fCtx.fillStyle = grad;
  fCtx.fillRect(0, 0, foamSize, foamSize);

  const foamRing = new THREE.CanvasTexture(foamCanvas);
  foamRing.colorSpace = THREE.SRGBColorSpace;
  foamRing.anisotropy = maxAnisotropy;

  return {
    steelBump,
    steelRoughness,
    concreteBump,
    foamRing,
    dispose: () => {
      steelBump.dispose();
      steelRoughness.dispose();
      concreteBump.dispose();
      foamRing.dispose();
    },
  };
}

/**
 * Generates a crisp high-DPI floating label sprite texture for landmarks, axes, or angles.
 */
export function createBadgeSpriteTexture(
  primaryText: string,
  secondaryText: string | null,
  accentHex: string,
  variant: 'landmark' | 'axis' | 'angle' | 'camera' = 'landmark',
  isSelected = false,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const w = variant === 'axis' ? 128 : variant === 'angle' ? 256 : 240;
  const h = variant === 'axis' ? 128 : secondaryText ? 92 : 68;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  if (variant === 'axis') {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 42, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = accentHex;
    ctx.stroke();

    ctx.fillStyle = accentHex;
    ctx.font = '700 40px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(primaryText, w / 2, h / 2 + 2);
  } else {
    const pad = 8;
    const rw = w - pad * 2;
    const rh = h - pad * 2;
    const r = 14;

    ctx.beginPath();
    ctx.roundRect(pad, pad, rw, rh, r);
    ctx.fillStyle = isSelected
      ? 'rgba(15, 23, 42, 0.96)'
      : variant === 'angle'
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.97)';
    ctx.fill();

    ctx.lineWidth = isSelected ? 4.5 : 3;
    ctx.strokeStyle = isSelected || variant === 'angle' ? accentHex : '#334155';
    ctx.stroke();

    // Accent bar on left inside card
    ctx.beginPath();
    ctx.roundRect(pad + 10, pad + 11, 7, rh - 22, 3.5);
    ctx.fillStyle = accentHex;
    ctx.fill();

    const textColor = isSelected || variant === 'angle' ? '#ffffff' : '#0f172a';
    const subColor = isSelected || variant === 'angle' ? '#e2e8f0' : '#334155';

    ctx.fillStyle = textColor;
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (secondaryText) {
      ctx.fillText(primaryText, pad + 26, h / 2 - 14);
      ctx.fillStyle = subColor;
      ctx.font = '600 19px "JetBrains Mono", monospace';
      ctx.fillText(secondaryText, pad + 26, h / 2 + 17);
    } else {
      ctx.fillText(primaryText, pad + 26, h / 2 + 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
