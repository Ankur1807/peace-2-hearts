
/**
 * Peace2Hearts logo vector renderer (crisp, scalable, strict alignment)
 */
import { logoColors } from './logoColors';

/**
 * Draw a heart shape (centered @ 50,50, with size 80) using classic heart parametric equations.
 */
const drawHeartPath = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
): void => {
  ctx.beginPath();
  // Use polar form to get smooth, classic heart shape
  for(let t = 0; t <= Math.PI; t += 0.02) {
    const x = size * 0.5 * (16 * Math.pow(Math.sin(t), 3));
    const y = -size * 0.5 * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    if (t === 0) ctx.moveTo(centerX + x, centerY + y);
    else ctx.lineTo(centerX + x, centerY + y);
  }
  ctx.closePath();
};

/**
 * Find the heart's bottom point and lobe control points for peace symbol alignment.
 */
const getHeartAnchorPoints = (
  centerX: number,
  centerY: number,
  size: number
) => {
  // Bottom tip at t = pi (radians)
  const tBottom = Math.PI;
  const bx = centerX + size * 0.5 * (16 * Math.pow(Math.sin(tBottom), 3));
  const by = centerY - size * 0.5 * (13 * Math.cos(tBottom) - 5 * Math.cos(2*tBottom) - 2 * Math.cos(3*tBottom) - Math.cos(4*tBottom));

  // Left lobe inner "nook" around t ≈ 2.4 rad; right lobe at ≈ 0.75 rad
  const tLeftLobe = 2.375;
  const tRightLobe = 0.75;
  const lx = centerX + size * 0.5 * (16 * Math.pow(Math.sin(tLeftLobe), 3));
  const ly = centerY - size * 0.5 * (13 * Math.cos(tLeftLobe) - 5 * Math.cos(2*tLeftLobe) - 2 * Math.cos(3*tLeftLobe) - Math.cos(4*tLeftLobe));
  const rx = centerX + size * 0.5 * (16 * Math.pow(Math.sin(tRightLobe), 3));
  const ry = centerY - size * 0.5 * (13 * Math.cos(tRightLobe) - 5 * Math.cos(2*tRightLobe) - 2 * Math.cos(3*tRightLobe) - Math.cos(4*tRightLobe));

  return {
    bottom: {x: bx, y: by},
    leftLobe: {x: lx, y: ly},
    rightLobe: {x: rx, y: ry}
  };
};

/**
 * Draw a five-pointed star at (cx, cy) of given radius and color.
 */
const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string
) => {
  const spikes = 5;
  const step = Math.PI / spikes;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.4;
    const angle = -Math.PI/2 + i * step;
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 1;
  ctx.shadowColor = "transparent";
  ctx.fill();
  ctx.restore();
};

export const drawHeartWithPeace = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  size: number
): void => {
  const { heartColor, contrastColor } = logoColors;

  ctx.save();

  // All coordinates based off normalized (100x100) system for clarity
  const centerX = x + size/2;
  const centerY = y + size/2;
  const heartSize = size * 0.92; // heart fits snugly inside given region

  // --- Heart ---
  drawHeartPath(ctx, centerX, centerY, heartSize);
  ctx.fillStyle = heartColor;
  ctx.strokeStyle = heartColor;
  ctx.lineWidth = size * 0.05;
  ctx.fill();
  ctx.stroke();

  // --- Key points for peace symbol alignment ---
  const anchors = getHeartAnchorPoints(centerX, centerY, heartSize * 0.97);

  // --- Peace symbol circle ---
  // Find smallest circle the three points fit into (approximation)
  // This is the circumcircle. 3 points define it exactly.
  const ax = anchors.bottom.x, ay = anchors.bottom.y;
  const bx = anchors.leftLobe.x, by = anchors.leftLobe.y;
  const cx_ = anchors.rightLobe.x, cy_ = anchors.rightLobe.y;
  // Circumcenter math
  const D = 2 * (ax*(by-cy_) + bx*(cy_-ay) + cx_*(ay-by));
  const Ux = ((ax*ax + ay*ay)*(by-cy_) + (bx*bx + by*by)*(cy_-ay) + (cx_*cx_ + cy_*cy_)*(ay-by)) / D;
  const Uy = ((ax*ax + ay*ay)*(cx_-bx) + (bx*bx + by*by)*(ax-cx_) + (cx_*cx_ + cy_*cy_)*(bx-ax)) / D;
  const peaceR = Math.sqrt((Ux-ax)**2 + (Uy-ay)**2);

  ctx.beginPath();
  ctx.arc(Ux, Uy, peaceR, 0, 2 * Math.PI);
  ctx.strokeStyle = contrastColor;
  ctx.lineWidth = size * 0.032;
  ctx.stroke();

  // --- Peace lines (DO NOT extend outside the circle) ---
  // Center (circular center)
  // Top vertical: from circle center to bottom point (downward)
  ctx.beginPath();
  ctx.moveTo(Ux, Uy - peaceR * 0.02);
  ctx.lineTo(ax, ay - peaceR * 0.02);
  ctx.strokeStyle = contrastColor;
  ctx.lineWidth = size * 0.025;
  ctx.lineCap = "round";
  ctx.stroke();

  // Diagonals:
  ctx.beginPath();
  ctx.moveTo(Ux, Uy);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(Ux, Uy);
  ctx.lineTo(cx_, cy_);
  ctx.stroke();

  // --- 9 evenly spaced stars around/accenting the heart ---
  // Compute an ellipse path slightly around the heart's perimeter
  const starOrbitR = heartSize * 0.59;
  for (let i = 0; i < 9; i++) {
    const angle = Math.PI/2 + (i * 2 * Math.PI/9); // start at top, go CW
    const starX = centerX + Math.cos(angle) * starOrbitR;
    const starY = centerY + Math.sin(angle) * (starOrbitR * 0.97);
    drawStar(ctx, starX, starY, size * 0.06, contrastColor);
  }

  ctx.restore();
};

