
/**
 * Drawing function for cover image version of the logo
 */
import { drawHeartWithPeace } from './drawHeartLogo';
import { drawWavyPatterns } from './drawPatterns';

/**
 * Draw a cover image version of the logo - rectangle format with logo and text
 */
export const drawCoverLogo = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background gradient - horizontal gradient with purple
  const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  backgroundGradient.addColorStop(0, '#6D28D9');    // darker purple
  backgroundGradient.addColorStop(0.5, '#8B5CF6');  // vibrantPurple
  backgroundGradient.addColorStop(1, '#6D28D9');    // darker purple
  
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add decorative wave patterns for background
  drawWavyPatterns(ctx, canvas.width, canvas.height);
  
  // Calculate sizes for logo and text
  const logoHeight = canvas.height * 0.7;
  const logoWidth = logoHeight; // Keep it square
  const logoX = canvas.width * 0.2 - logoWidth / 2;
  const logoY = (canvas.height - logoHeight) / 2;
  
  // Draw the heart with peace symbol
  drawHeartWithPeace(ctx, logoX, logoY, logoHeight);
  
  // Draw brand name
  const brandName = "Peace2Hearts";
  const fontSize = Math.floor(canvas.height * 0.2);
  ctx.font = `bold ${fontSize}px Lora, serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  
  // Draw text with shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  const textX = canvas.width * 0.35;
  const textY = canvas.height / 2;
  ctx.fillText(brandName, textX, textY);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Add tagline
  const tagline = "Helping you find peace, with or without love.";
  ctx.font = `italic ${fontSize * 0.5}px 'Open Sans', sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(tagline, textX, textY + fontSize * 0.8);
};
