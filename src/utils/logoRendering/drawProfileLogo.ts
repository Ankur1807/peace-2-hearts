
/**
 * Drawing function for profile picture version of the logo
 */
import { logoColors } from './logoColors';
import { drawHeartWithPeace } from './drawHeartLogo';

/**
 * Draw a profile picture version of the logo - square format focused on the heart
 */
export const drawProfileLogo = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Purple background gradient
  const backgroundGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.7
  );
  backgroundGradient.addColorStop(0, '#8B5CF6');  // vibrantPurple
  backgroundGradient.addColorStop(1, '#6D28D9');  // darker purple
  
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw a glowing effect
  const glowGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.5
  );
  glowGradient.addColorStop(0, 'rgba(249, 168, 212, 0.3)');  // softPink with transparency
  glowGradient.addColorStop(1, 'rgba(14, 165, 233, 0)');     // transparent blue
  
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Calculate heart size - making it large but with padding
  const heartSize = Math.min(canvas.width, canvas.height) * 0.7;
  const x = (canvas.width - heartSize) / 2;
  const y = (canvas.height - heartSize) / 2;
  
  // Draw the heart with peace symbol
  drawHeartWithPeace(ctx, x, y, heartSize);
};
