
import React from 'react';
import { Link } from 'react-router-dom';

interface CircuitHeartLogoProps {
  className?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CircuitHeartLogo: React.FC<CircuitHeartLogoProps> = ({ 
  className = '',
  textColor = 'text-white',
  size = 'md'
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
      {/* Circuit Heart SVG Logo */}
      <div className={`${svgSize} relative group`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Heart outline */}
          <path 
            d="M50 90C47.5 90 45 89 42.5 87.5C30 80 10 60 10 35C10 22.5 20 12.5 32.5 12.5C40 12.5 46.25 16.25 50 22.5C53.75 16.25 60 12.5 67.5 12.5C80 12.5 90 22.5 90 35C90 60 70 80 57.5 87.5C55 89 52.5 90 50 90Z" 
            stroke="#9b87f5" 
            strokeWidth="3"
            fill="rgba(155, 135, 245, 0.1)"
          />

          {/* Circuit lines */}
          <path d="M25 35H40" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 35H75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 50H75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 65H40" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 65H75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          
          {/* Vertical circuit lines */}
          <path d="M35 25V75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 25V75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          <path d="M65 25V75" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
          
          {/* Connection points */}
          <circle cx="35" cy="35" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="65" cy="35" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="35" cy="50" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="50" cy="50" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="65" cy="50" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="35" cy="65" r="3" fill="#9b87f5" className="animate-pulse" />
          <circle cx="65" cy="65" r="3" fill="#9b87f5" className="animate-pulse" />
        </svg>

        {/* Subtle pulse overlay for hover effect */}
        <div className="absolute inset-0 bg-vibrantPurple opacity-0 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
      </div>
      
      {/* Brand name */}
      <span className={`font-lora ${textSize} font-semibold ${textColor}`}>Peace2Hearts</span>
    </Link>
  );
};

export default CircuitHeartLogo;
