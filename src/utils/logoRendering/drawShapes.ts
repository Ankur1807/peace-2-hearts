
/**
 * Utility functions for drawing basic shapes used in the logo
 */

/**
 * Draws a heart path on the canvas
 */
export const drawHeartPath = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  size: number, 
  scale: number
): void => {
  // Calculate dimensions for the heart
  const width = size * scale;
  const height = size * scale;
  
  // Convert center position to top-left position
  const x = (centerX - size/2) * scale;
  const y = (centerY - size/2) * scale;
  
  // Start at the bottom point of the heart
  const bottomPointX = x + width / 2;
  const bottomPointY = y + height * 0.9;
  
  ctx.moveTo(bottomPointX, bottomPointY);
  
  // Draw the left side of the heart
  ctx.bezierCurveTo(
    x + width / 2 * 0.5, y + height * 0.85,  // control point 1
    x, y + height * 0.4,                     // control point 2
    x, y + height * 0.25                     // end point
  );
  
  // Draw the left arc at the top of the heart
  ctx.bezierCurveTo(
    x, y,                                    // control point 1
    x + width * 0.3, y,                      // control point 2
    x + width / 2, y + height * 0.3          // end point
  );
  
  // Draw the right arc at the top of the heart
  ctx.bezierCurveTo(
    x + width * 0.7, y,                      // control point 1
    x + width, y,                            // control point 2
    x + width, y + height * 0.25             // end point
  );
  
  // Draw the right side of the heart
  ctx.bezierCurveTo(
    x + width, y + height * 0.4,             // control point 1
    x + width / 2 * 1.5, y + height * 0.85,  // control point 2
    bottomPointX, bottomPointY               // end point
  );
};

/**
 * Draws a star shape on the canvas
 */
export const drawStar = (
  ctx: CanvasRenderingContext2D, 
  cx: number, 
  cy: number, 
  outerRadius: number, 
  points: number = 5, 
  color: string, 
  scale: number
): void => {
  const innerRadius = outerRadius * 0.4;
  ctx.beginPath();
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius * scale : innerRadius * scale;
    // Start at the top (270 degrees = -90 in standard position)
    const startAngle = -Math.PI / 2;
    const angle = startAngle + (i / (points * 2)) * Math.PI * 2;
    const x = cx * scale + Math.cos(angle) * radius;
    const y = cy * scale + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

/**
 * Draws a simple dot (circle) on the canvas
 */
export const drawDot = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  color: string, 
  scale: number
): void => {
  ctx.beginPath();
  ctx.arc(centerX * scale, centerY * scale, radius * scale, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};
