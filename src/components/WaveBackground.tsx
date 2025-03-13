
import React, { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Wave parameters
    const waves = [
      { y: height * 0.4, amplitude: 20, frequency: 0.01, speed: 0.02, color: 'rgba(139, 92, 246, 0.04)' }, // vibrantPurple
      { y: height * 0.45, amplitude: 15, frequency: 0.02, speed: 0.03, color: 'rgba(14, 165, 233, 0.03)' }, // peacefulBlue
      { y: height * 0.5, amplitude: 25, frequency: 0.015, speed: 0.015, color: 'rgba(217, 70, 239, 0.025)' } // vividPink
    ];
    
    let mouseX = 0;
    const interactivity = 0.3; // Strength of mouse interaction
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const time = { value: 0 };
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw each wave
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.fillStyle = wave.color;
        
        // Start drawing from the left of the screen
        ctx.moveTo(0, wave.y);
        
        // Draw wave points
        for (let x = 0; x < width; x += 5) {
          // Create basic sine wave
          const basicWave = Math.sin(x * wave.frequency + time.value * wave.speed) * wave.amplitude;
          
          // Add mouse interaction effect - stronger near mouse position
          const distanceFromMouse = Math.abs(x - mouseX);
          const mouseEffect = Math.max(0, 100 - distanceFromMouse) * interactivity * Math.sin(time.value * 0.1);
          
          // Combine effects
          const y = wave.y + basicWave + (mouseEffect * (x > mouseX - 100 && x < mouseX + 100 ? 1 : 0));
          
          ctx.lineTo(x, y);
        }
        
        // Complete the wave shape by drawing to the bottom and back to start
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      });
      
      // Update time
      time.value += 1;
      requestAnimationFrame(animate);
    };
    
    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Update wave positions on resize
      waves[0].y = height * 0.4;
      waves[1].y = height * 0.45;
      waves[2].y = height * 0.5;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default WaveBackground;
