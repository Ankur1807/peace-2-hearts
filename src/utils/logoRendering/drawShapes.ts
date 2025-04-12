
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

/**
 * Draws a tree branch path for the peace symbol
 */
export const drawTreeBranch = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  thickness: number,
  scale: number,
  hasLeaves: boolean = true
): void => {
  // Scale all coordinates
  const sX = startX * scale;
  const sY = startY * scale;
  const eX = endX * scale;
  const eY = endY * scale;
  const thck = thickness * scale;
  
  // Calculate control points for the curve
  // For a natural look, we'll add some variation to the control points
  const dx = eX - sX;
  const dy = eY - sY;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate perpendicular direction for control points
  const perpX = -dy / len;
  const perpY = dx / len;
  
  // Control point offsets - adjust these for different curve shapes
  const ctrlDist = len * 0.5;
  const ctrlOffset = len * 0.2;
  
  // Calculate control points
  const ctrl1X = sX + dx * 0.25 + perpX * ctrlOffset;
  const ctrl1Y = sY + dy * 0.25 + perpY * ctrlOffset;
  const ctrl2X = sX + dx * 0.75 - perpX * ctrlOffset;
  const ctrl2Y = sY + dy * 0.75 - perpY * ctrlOffset;
  
  // Draw the main branch curve
  ctx.beginPath();
  ctx.moveTo(sX, sY);
  ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, eX, eY);
  ctx.lineWidth = thck;
  ctx.lineCap = 'round';
  
  // Create gradient for the branch
  const gradient = ctx.createLinearGradient(sX, sY, eX, eY);
  gradient.addColorStop(0, '#F2FCE2'); // Lighter green at start
  gradient.addColorStop(1, '#86EFAC'); // Darker green at end
  
  ctx.strokeStyle = gradient;
  ctx.stroke();
  
  // Add a subtle glow effect
  ctx.beginPath();
  ctx.moveTo(sX, sY);
  ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, eX, eY);
  ctx.lineWidth = thck * 1.5;
  ctx.strokeStyle = 'rgba(242, 252, 226, 0.2)'; // Very light green glow
  ctx.globalCompositeOperation = 'screen';
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  
  // Optionally add small leaves/buds along the branch
  if (hasLeaves) {
    // Add 2-3 small leaf buds along the branch
    for (let i = 1; i <= 3; i++) {
      const t = i / 4; // Position along the branch (1/4, 2/4, 3/4)
      const leafX = sX + dx * t + (Math.random() * 2 - 1) * scale;
      const leafY = sY + dy * t + (Math.random() * 2 - 1) * scale;
      
      // Draw a small leaf/bud
      ctx.beginPath();
      ctx.arc(leafX, leafY, scale * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#A3F2BE'; // Light green for the leaves
      ctx.fill();
    }
  }
};
