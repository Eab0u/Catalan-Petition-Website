import * as THREE from "three";

export type FlagVariant = "senyera" | "estelada";

const YELLOW = "#fcdd09";
const RED = "#da121a";
const BLUE = "#004b98";
const WHITE = "#ffffff";

// Draws the senyera (9 alternating stripes, 5 yellow + 4 red) onto a
// canvas, then for the estelada variant adds the blue triangle with the
// white star over the hoist side. Returns a THREE.CanvasTexture — no
// downloaded image or 3D model involved.
export function createFlagTexture(variant: FlagVariant): THREE.CanvasTexture {
  const width = 1024;
  const height = 683; // ~3:2, the traditional senyera aspect ratio
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const stripeCount = 9;
  const stripeHeight = height / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? YELLOW : RED;
    ctx.fillRect(0, i * stripeHeight, width, stripeHeight + 1);
  }

  if (variant === "estelada") {
    const triangleWidth = width * 0.42;
    ctx.fillStyle = BLUE;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(triangleWidth, height / 2);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    drawStar(ctx, triangleWidth * 0.38, height / 2, height * 0.17, WHITE);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string
) {
  const points = 5;
  const innerRadius = radius * 0.45;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}
