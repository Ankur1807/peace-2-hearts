
import React, { useEffect, useRef } from 'react';

interface SocialMediaLogoProps {
  type: 'profile' | 'cover';
  size?: { width: number; height: number };
  onRender?: (canvas: HTMLCanvasElement) => void;
}

const SocialMediaLogo: React.FC<SocialMediaLogoProps> = ({ 
  type = 'profile',
  size = type === 'profile' 
    ? { width: 1200, height: 1200 } 
    : { width: 1500, height: 500 },
  onRender
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define colors - matching our existing branding
  const logoColor = "#0EA5E9"; // peacefulBlue
  const peaceSymbolColor = "#F9A8D4"; // softPink (replacing the orange with pink as requested)
  const secondaryColor = "#86EFAC"; // softGreen
  const accentColor = "#D946EF"; // vividPink
  const tertiaryColor = "#8B5CF6"; // vibrantPurple
  const shadowColor = "rgba(14, 165, 233, 0.4)"; // peacefulBlue with transparency for shadows
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // For profile picture (square format focused on the heart/peace symbol)
    if (type === 'profile') {
      // Background gradient
      const backgroundGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      backgroundGradient.addColorStop(0, '#0EA5E9');  // peacefulBlue
      backgroundGradient.addColorStop(1, '#0a7ba9');  // darker blue
      
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
      
    } else {
      // For cover image (rectangle format with logo and text)
      // Background gradient - horizontal gradient
      const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      backgroundGradient.addColorStop(0, '#0a7ba9');    // darker blue
      backgroundGradient.addColorStop(0.5, '#0EA5E9');  // peacefulBlue
      backgroundGradient.addColorStop(1, '#0a7ba9');    // darker blue
      
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
    }
    
    // Call onRender callback if provided
    if (onRender) {
      onRender(canvas);
    }
  }, [type, size, onRender]);
  
  // Helper function to draw the heart with peace symbol
  const drawHeartWithPeace = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number
  ) => {
    // Scale everything to fit within the provided size
    const scale = size / 100;
    
    // Function to scale coordinates
    const scalePos = (pos: number) => pos * scale;
    
    // Translate context to the starting position
    ctx.save();
    ctx.translate(x, y);
    
    // Decorative outer ring
    ctx.beginPath();
    ctx.arc(scalePos(50), scalePos(50), scalePos(42), 0, Math.PI * 2);
    ctx.strokeStyle = tertiaryColor;
    ctx.lineWidth = scalePos(1.5);
    ctx.setLineDash([scalePos(4), scalePos(2)]);
    ctx.stroke();
    ctx.setLineDash([]);
    
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
    
    // Inner decorative pattern
    ctx.beginPath();
    ctx.arc(scalePos(50), scalePos(50), scalePos(30), 0, Math.PI * 2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = scalePos(1);
    ctx.setLineDash([scalePos(3), scalePos(3)]);
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    
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
    
    // Small accent circles along heart outline
    drawAccentCircle(ctx, 20, 35, 2, secondaryColor, scale);
    drawAccentCircle(ctx, 80, 35, 2, secondaryColor, scale);
    drawAccentCircle(ctx, 30, 25, 2, tertiaryColor, scale);
    drawAccentCircle(ctx, 70, 25, 2, tertiaryColor, scale);
    drawAccentCircle(ctx, 25, 70, 2, accentColor, scale);
    drawAccentCircle(ctx, 75, 70, 2, accentColor, scale);
    drawAccentCircle(ctx, 50, 15, 2, logoColor, scale);
    drawAccentCircle(ctx, 50, 85, 2, logoColor, scale);
    
    // Energy lines radiating from center
    drawDashedLine(ctx, 50, 50, 30, 35, tertiaryColor, 1, 2, 2, 0.7, scale);
    drawDashedLine(ctx, 50, 50, 70, 35, accentColor, 1, 2, 2, 0.7, scale);
    drawDashedLine(ctx, 50, 50, 40, 80, secondaryColor, 1, 2, 2, 0.7, scale);
    drawDashedLine(ctx, 50, 50, 60, 80, secondaryColor, 1, 2, 2, 0.7, scale);
    
    // Restore context
    ctx.restore();
  };
  
  // Helper function to draw a heart path
  const drawHeartPath = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    size: number, 
    scale: number
  ) => {
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
  
  // Helper function to draw an accent circle
  const drawAccentCircle = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    color: string, 
    scale: number
  ) => {
    ctx.beginPath();
    ctx.arc(centerX * scale, centerY * scale, radius * scale, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  
  // Helper function to draw a dashed line
  const drawDashedLine = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    color: string, 
    lineWidth: number, 
    dashLen: number, 
    gapLen: number, 
    opacity: number, 
    scale: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(fromX * scale, fromY * scale);
    ctx.lineTo(toX * scale, toY * scale);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * scale;
    ctx.setLineDash([dashLen * scale, gapLen * scale]);
    ctx.globalAlpha = opacity;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };
  
  // Helper function to draw wavy patterns in the background
  const drawWavyPatterns = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
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
    gradient1.addColorStop(0, 'rgba(139, 92, 246, 0.1)'); // vibrantPurple with low opacity
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

  // Render an invisible canvas that will be used for rendering/saving
  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'none' }}
      width={size.width}
      height={size.height}
    />
  );
};

export default SocialMediaLogo;
