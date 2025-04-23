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
  const radius = 25; // Adjusted: tighter so stars are inside heart, circling peace symbol closely
  const starColors = [
    accentColor, secondaryColor, logoColor, // alternate for pop
    tertiaryColor, accentColor, secondaryColor,
    tertiaryColor, accentColor, logoColor
  ];
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 - Math.PI/2; // Start at top
    const sx = 50 + Math.cos(angle) * radius;
    const sy = 54 + Math.sin(angle) * radius; // center of peace symbol is now at y=54
    // Cycle through colors
    const color = starColors[i % starColors.length];
    drawStar(ctx, sx, sy, 2.6, 5, color, scale);
  }

  // Peace symbol circle (now fits snugly, tangent to inside of heart)
  ctx.beginPath();
  ctx.arc(50 * scale, 54 * scale, 30 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = peaceSymbolColor;
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Draw tree branches as the three peace symbol lines, keeping diagonals inside the circle

  // Vertical branch: from pointed top of heart to center of peace circle
  // Top heart tip at (50, 22), peace circle center at (50, 54)
  drawTreeBranch(ctx, 50, 22, 50, 54, 2.5, scale, true);

  // Left diagonal (inside circle): from center to lower left inside the peace circle
  // Let's use (50,54) to (33,75)
  drawTreeBranch(ctx, 50, 54, 33, 75, 2.5, scale, true);

  // Right diagonal (inside circle): from center to lower right inside the peace circle
  drawTreeBranch(ctx, 50, 54, 67, 75, 2.5, scale, true);

  // Central white dot at the center of the peace symbol - TOP LAYER
  drawDot(ctx, 50, 54, 3.5, '#FFFFFF', scale);

  ctx.restore();
};
