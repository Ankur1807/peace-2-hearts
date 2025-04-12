
/**
 * Core drawing functions for the Peace2Hearts logo
 */
import { drawHeartPath, drawStar, drawDot } from '../../utils/logoRendering/drawShapes';
import { 
  drawFlowingLines, 
  drawSparklePattern, 
  drawCurvedEnergyLine,
  drawWavyPatterns 
} from '../../utils/logoRendering/drawPatterns';

/**
 * Color definitions for the Peace2Hearts logo
 */
export const logoColors = {
  logoColor: "#0EA5E9", // peacefulBlue
  peaceSymbolColor: "#F9A8D4", // softPink (replacing orange with pink as requested)
  secondaryColor: "#86EFAC", // softGreen
  accentColor: "#D946EF", // vividPink
  tertiaryColor: "#8B5CF6", // vibrantPurple - used for background
  shadowColor: "rgba(14, 165, 233, 0.4)", // peacefulBlue with transparency for shadows
};

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
  
  // Function to scale coordinates
  const scalePos = (pos: number) => pos * scale;
  
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
  ctx.lineWidth = scalePos(4);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.fill();
  ctx.stroke();
  
  // Replace outer circle with flowing lines
  drawFlowingLines(ctx, 50, 50, 40, scale, tertiaryColor, 1.5);
  
  // Replace inner circle with subtle sparkles
  drawSparklePattern(ctx, 50, 50, 30, scale, accentColor, secondaryColor, logoColor);
  
  // Peace symbol circle
  ctx.beginPath();
  ctx.arc(scalePos(50), scalePos(50), scalePos(20), 0, Math.PI * 2);
  ctx.strokeStyle = peaceSymbolColor;
  ctx.lineWidth = scalePos(2.5);
  ctx.stroke();
  
  // Peace symbol lines
  // Vertical line
  ctx.beginPath();
  ctx.moveTo(scalePos(50), scalePos(30));
  ctx.lineTo(scalePos(50), scalePos(70));
  ctx.strokeStyle = peaceSymbolColor;
  ctx.lineWidth = scalePos(2.5);
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Left diagonal line
  ctx.beginPath();
  ctx.moveTo(scalePos(50), scalePos(50));
  ctx.lineTo(scalePos(35), scalePos(65));
  ctx.stroke();
  
  // Right diagonal line
  ctx.beginPath();
  ctx.moveTo(scalePos(50), scalePos(50));
  ctx.lineTo(scalePos(65), scalePos(65));
  ctx.stroke();
  
  // Connection point
  ctx.beginPath();
  ctx.arc(scalePos(50), scalePos(50), scalePos(3), 0, Math.PI * 2);
  ctx.fillStyle = peaceSymbolColor;
  ctx.fill();
  
  // Small accent stars instead of circles
  drawStar(ctx, 20, 35, 2.5, 5, secondaryColor, scale);
  drawStar(ctx, 80, 35, 2.5, 5, secondaryColor, scale);
  drawStar(ctx, 30, 25, 2.5, 5, tertiaryColor, scale);
  drawStar(ctx, 70, 25, 2.5, 5, tertiaryColor, scale);
  drawStar(ctx, 25, 70, 2.5, 5, accentColor, scale);
  drawStar(ctx, 75, 70, 2.5, 5, accentColor, scale);
  
  // Energy lines radiating from center - make them more dynamic
  drawCurvedEnergyLine(ctx, 50, 50, 30, 35, tertiaryColor, 1, scale);
  drawCurvedEnergyLine(ctx, 50, 50, 70, 35, accentColor, 1, scale);
  drawCurvedEnergyLine(ctx, 50, 50, 40, 80, secondaryColor, 1, scale);
  drawCurvedEnergyLine(ctx, 50, 50, 60, 80, secondaryColor, 1, scale);
  
  // Restore context
  ctx.restore();
};

/**
 * Draw a profile picture version of the logo - square format focused on the heart
 */
export const drawProfileLogo = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void => {
  const { tertiaryColor } = logoColors;
  
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
