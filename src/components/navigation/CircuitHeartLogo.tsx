
import React from 'react';
import { Link } from 'react-router-dom';
import HeartLogoWrapper from './logo/HeartLogoWrapper';

interface CircuitHeartLogoProps {
  className?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  animationClass?: string;
}

const CircuitHeartLogo: React.FC<CircuitHeartLogoProps> = ({ 
  className = '',
  textColor = 'text-white',
  size = 'md',
  animationClass = 'strong-heartbeat-glow'
}) => {
  // Calculate SVG and text sizes based on the size prop
  const getSvgSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-md';
      case 'lg': return 'text-2xl';
      default: return 'text-lg md:text-xl';
    }
  };

  const svgSize = getSvgSize();
  const textSize = getTextSize();
  
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} onClick={(e) => {
      // Prevent default if we're already on the homepage to avoid double navigation
      if (window.location.pathname === '/') {
        e.preventDefault();
        
        // Scroll to top with a smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }}>
      {/* Enhanced Peace Heart SVG Logo */}
      <HeartLogoWrapper svgSize={svgSize} animationClass={animationClass} />
      
      {/* Brand name */}
      <span className={`font-lora ${textSize} font-bold ${textColor} drop-shadow-sm`}>Peace2Hearts</span>
    </Link>
  );
};

export default CircuitHeartLogo;
