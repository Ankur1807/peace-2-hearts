
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
  
  // Replace inner circle with subtle sparkles
  drawSparklePattern(ctx, 50, 50, 30, scale, accentColor, secondaryColor, logoColor);
  
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
  
  // Small accent stars instead of previous square shapes
  drawStar(ctx, 20, 35, 2.5, 5, secondaryColor, scale);
  drawStar(ctx, 80, 35, 2.5, 5, secondaryColor, scale);
  drawStar(ctx, 30, 25, 2.5, 5, tertiaryColor, scale);
  drawStar(ctx, 70, 25, 2.5, 5, tertiaryColor, scale);
  drawStar(ctx, 25, 70, 2.5, 5, accentColor, scale);
  drawStar(ctx, 75, 70, 2.5, 5, accentColor, scale);
  drawStar(ctx, 50, 15, 2.5, 5, logoColor, scale);
  drawStar(ctx, 50, 85, 2.5, 5, logoColor, scale);
  
  // Central white dot at the center of the peace symbol - MOVED TO END to draw it on top
  drawDot(ctx, 50, 50, 3.5, '#FFFFFF', scale);
  
  // Restore context
  ctx.restore();
};
