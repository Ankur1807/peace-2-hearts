
import React, { useEffect, useRef } from 'react';
import { drawProfileLogo, drawCoverLogo } from './LogoDrawer';

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
    
    // Draw the appropriate logo based on type
    if (type === 'profile') {
      drawProfileLogo(ctx, canvas);
    } else {
      drawCoverLogo(ctx, canvas);
    }
    
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
