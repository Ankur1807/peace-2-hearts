
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
  const peaceSymbolColor = "#F9A8D4"; // softPink (replacing orange with pink as requested)
  const secondaryColor = "#86EFAC"; // softGreen
  const accentColor = "#D946EF"; // vividPink
  const tertiaryColor = "#8B5CF6"; // vibrantPurple - used for background
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
      // Purple background gradient instead of blue
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
      
    } else {
      // For cover image (rectangle format with logo and text)
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
    }
    
    // Call onRender callback if provided
    if (onRender) {
      onRender(canvas);
    }
  }, [type, size, onRender]);
  
  // Helper function to draw the heart with peace symbol - updated design
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
    drawSparklePattern(ctx, 50, 50, 30, scale);
    
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
  
  // New helper function to draw flowing lines instead of circles
  const drawFlowingLines = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    scale: number, 
    color: string,
    lineWidth: number
  ) => {
    ctx.beginPath();
    const steps = 60;
    
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const variation = Math.sin(i * 6) * 4; // Creates a wavy effect
      const pointRadius = (radius + variation) * scale;
      const x = centerX * scale + Math.cos(angle) * pointRadius;
      const y = centerY * scale + Math.sin(angle) * pointRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * scale;
    ctx.stroke();
  };
  
  // New helper function to draw sparkle pattern instead of inner circle
  const drawSparklePattern = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    scale: number
  ) => {
    const sparkleCount = 12;
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      const x = centerX * scale + Math.cos(angle) * radius * scale;
      const y = centerY * scale + Math.sin(angle) * radius * scale;
      
      // Draw small sparkle
      if (i % 3 === 0) {
        drawStar(ctx, x / scale, y / scale, 1.5, 4, accentColor, scale);
      } else if (i % 3 === 1) {
        drawStar(ctx, x / scale, y / scale, 1, 4, secondaryColor, scale);
      } else {
        drawDot(ctx, x / scale, y / scale, 1.2, logoColor, scale);
      }
    }
  };
  
  // Helper function to draw a star
  const drawStar = (
    ctx: CanvasRenderingContext2D, 
    cx: number, 
    cy: number, 
    outerRadius: number, 
    points: number, 
    color: string, 
    scale: number
  ) => {
    const innerRadius = outerRadius * 0.4;
    ctx.beginPath();
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2;
      const x = cx * scale + Math.cos(angle) * radius * scale;
      const y = cy * scale + Math.sin(angle) * radius * scale;
      
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
  
  // Helper function to draw a dot (for smaller accents)
  const drawDot = (
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
  
  // Helper function to draw curved energy lines
  const drawCurvedEnergyLine = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    color: string, 
    lineWidth: number, 
    scale: number
  ) => {
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
