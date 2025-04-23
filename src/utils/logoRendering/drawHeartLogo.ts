
/**
 * Core drawing functions for the Peace2Hearts heart logo
 */
import { logoColors } from './logoColors';
import { drawHeartPath, drawStar, drawDot, drawTreeBranch } from './drawShapes';
import { drawSparklePattern } from './drawPatterns';

/**
 * Draw the heart with peace symbol - the core logo component
 */
export const drawHeartWithPeace = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  size: number
): void => {
  const { logoColor, peaceSymbolColor, secondaryColor, accentColor, tertiaryColor, shadowColor } = logoColors;
  
  // Scale everything to fit within the provided size
  const scale = size / 100;
  
  // Translate context to the starting position
  ctx.save();
  ctx.translate(x, y);
  
  // Base heart shadow
  ctx.beginPath();
  drawHeartPath(ctx, 53, 53, 86, scale);
  ctx.fillStyle = shadowColor;
  ctx.fill();

  // Main heart with glow
  ctx.beginPath();
  drawHeartPath(ctx, 50, 50, 80, scale);
  ctx.strokeStyle = logoColor;
  ctx.lineWidth = 4 * scale;
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.fill();
  ctx.stroke();

  // Draw 9 stars inside heart, in circular pattern surrounding peace symbol
  const starCount = 9;
  const radius = 30; // Distance from the center (must keep stars inside heart)
  const starColors = [
    accentColor, secondaryColor, logoColor, // alternate for pop
    tertiaryColor, accentColor, secondaryColor,
    tertiaryColor, accentColor, logoColor
  ];
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 - Math.PI/2; // Start at top
    const sx = 50 + Math.cos(angle) * radius;
    const sy = 50 + Math.sin(angle) * radius;
    // Cycle through colors
    const color = starColors[i % starColors.length];
    drawStar(ctx, sx, sy, 2.6, 5, color, scale);
  }

  // Peace symbol circle
  ctx.beginPath();
  ctx.arc(50 * scale, 50 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = peaceSymbolColor;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Draw tree branches instead of straight peace symbol lines
  // Vertical branch (top to bottom)
  drawTreeBranch(ctx, 50, 30, 50, 70, 2.5, scale);
  // Left diagonal branch (connects to heart edge)
  drawTreeBranch(ctx, 50, 50, 35, 65, 2.5, scale);
  // Right diagonal branch (connects to heart edge)
  drawTreeBranch(ctx, 50, 50, 65, 65, 2.5, scale);

  // Central white dot at the center of the peace symbol - TOP LAYER
  drawDot(ctx, 50, 50, 3.5, '#FFFFFF', scale);

  ctx.restore();
};
