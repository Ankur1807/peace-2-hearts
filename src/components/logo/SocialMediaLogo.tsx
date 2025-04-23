
import React, { useEffect, useRef } from 'react';
import { drawHeartWithPeace } from '../../utils/logoRendering/drawHeartLogo';

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
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw main logo with existing heart drawing function
    const logoSize = Math.min(size.width, size.height) * 0.7;
    const x = (size.width - logoSize) / 2;
    const y = (size.height - logoSize) / 2;
    drawHeartWithPeace(ctx, x, y, logoSize);
    
    // Call onRender callback if provided
    if (onRender) {
      onRender(canvas);
    }
  }, [type, size, onRender]);

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
