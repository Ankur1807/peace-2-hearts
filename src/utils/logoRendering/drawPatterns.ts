
/**
 * Utility functions for drawing decorative patterns used in the logo
 */

/**
 * Draws sparkle patterns in a circular arrangement
 */
export const drawSparklePattern = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  scale: number,
  accentColor: string,
  secondaryColor: string,
  logoColor: string
): void => {
  const sparkleCount = 12;
  
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2;
    const x = centerX * scale + Math.cos(angle) * radius * scale;
    const y = centerY * scale + Math.sin(angle) * radius * scale;
    
    // Draw sparkles with alternating styles and colors
    if (i % 3 === 0) {
      drawStar(ctx, x / scale, y / scale, 2.5, 5, accentColor, scale);
    } else if (i % 3 === 1) {
      drawStar(ctx, x / scale, y / scale, 2, 5, secondaryColor, scale);
    } else {
      drawStar(ctx, x / scale, y / scale, 1.8, 5, logoColor, scale);
    }
  }
};

/**
 * Draw a curved energy line from point to point
 */
export const drawCurvedEnergyLine = (
  ctx: CanvasRenderingContext2D, 
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number, 
  color: string, 
  lineWidth: number, 
  scale: number
): void => {
  const fromXScaled = fromX * scale;
  const fromYScaled = fromY * scale;
  const toXScaled = toX * scale;
  const toYScaled = toY * scale;
  
  // Control point offset for curve
  const cpX = (fromXScaled + toXScaled) / 2 + (Math.random() * 20 - 10);
  const cpY = (fromYScaled + toYScaled) / 2 + (Math.random() * 20 - 10);
  
  ctx.beginPath();
  ctx.moveTo(fromXScaled, fromYScaled);
  ctx.quadraticCurveTo(cpX, cpY, toXScaled, toYScaled);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * scale;
  ctx.setLineDash([scale * 2, scale * 2]);
  ctx.globalAlpha = 0.7;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
};

/**
 * Draws wavy patterns for background decoration
 */
export const drawWavyPatterns = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number
): void => {
  // Draw some subtle wave patterns in the background
  ctx.save();
  
  // First wave
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  
  // Create a gentle wave across the width
  for (let i = 0; i < width; i += width/10) {
    const x = i;
    const y = height * 0.7 + Math.sin(i/width * Math.PI * 2) * height * 0.05;
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  
  const gradient1 = ctx.createLinearGradient(0, height * 0.7, 0, height);
  gradient1.addColorStop(0, 'rgba(233, 213, 255, 0.15)'); // light purple with low opacity
  gradient1.addColorStop(1, 'rgba(14, 165, 233, 0.05)'); // peacefulBlue with very low opacity
  ctx.fillStyle = gradient1;
  ctx.fill();
  
  // Second wave (slightly different phase)
  ctx.beginPath();
  ctx.moveTo(0, height * 0.6);
  
  // Create another gentle wave across the width
  for (let i = 0; i < width; i += width/10) {
    const x = i;
    const y = height * 0.6 + Math.cos(i/width * Math.PI * 3) * height * 0.04;
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(width, height * 0.8);
  ctx.lineTo(0, height * 0.8);
  ctx.closePath();
  
  const gradient2 = ctx.createLinearGradient(0, height * 0.6, 0, height * 0.8);
  gradient2.addColorStop(0, 'rgba(249, 168, 212, 0.1)'); // softPink with low opacity
  gradient2.addColorStop(1, 'rgba(134, 239, 172, 0.05)'); // softGreen with very low opacity
  ctx.fillStyle = gradient2;
  ctx.fill();
  
  ctx.restore();
};

// Import drawStar and drawDot for use in drawSparklePattern
import { drawStar, drawDot } from './drawShapes';
