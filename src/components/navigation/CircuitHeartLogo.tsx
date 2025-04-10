
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
  
  // Main color for the logo
  const logoColor = "#0EA5E9"; // peacefulBlue
  const peaceSymbolColor = "#F97316"; // brightOrange - contrasting color for peace symbol
  const secondaryColor = "#86EFAC"; // softGreen for subtle accents
  const shadowColor = "rgba(14, 165, 233, 0.4)"; // peacefulBlue with transparency for shadows

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
      <div className={`${svgSize} relative group drop-shadow-lg`}>
        {/* Drop shadow for the entire logo */}
        <div className="absolute inset-0 opacity-40 blur-md bg-peacefulBlue rounded-full -z-10 transform scale-90"></div>
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-md"
        >
          {/* Base layer - shadow heart */}
          <path 
            d="M50 92C47 92 44 91 41 89C27 81 7 60 7 33C7 19 18 8 32 8C40 8 47 12 50 18C53 12 60 8 68 8C82 8 93 19 93 33C93 60 73 81 59 89C56 91 53 92 50 92Z" 
            fill={shadowColor}
            transform="translate(3, 3)"
          />
          
          {/* Main heart with stronger outline */}
          <path 
            d="M50 90C47.5 90 45 89 42.5 87.5C30 80 10 60 10 35C10 22.5 20 12.5 32.5 12.5C40 12.5 46.25 16.25 50 22.5C53.75 16.25 60 12.5 67.5 12.5C80 12.5 90 22.5 90 35C90 60 70 80 57.5 87.5C55 89 52.5 90 50 90Z" 
            stroke={logoColor} 
            strokeWidth="4"
            fill="rgba(14, 165, 233, 0.15)"
            className="drop-shadow-sm"
          />

          {/* Peace symbol in the center with contrasting color */}
          <circle cx="50" cy="50" r="17" stroke={peaceSymbolColor} strokeWidth="2.5" fill="transparent" />
          <path d="M50 33 L50 67" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 50 L33 67" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 50 L67 67" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Circuit lines - horizontal */}
          <path d="M10 35H33" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M67 35H90" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 65H25" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M75 65H90" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Circuit lines - vertical connections */}
          <path d="M25 35V65" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M75 35V65" stroke={logoColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Connection points with glowing effect */}
          <circle cx="25" cy="35" r="3.5" fill={logoColor} className="animate-pulse" filter="url(#glow)" />
          <circle cx="75" cy="35" r="3.5" fill={logoColor} className="animate-pulse" filter="url(#glow)" />
          <circle cx="25" cy="65" r="3.5" fill={logoColor} className="animate-pulse" filter="url(#glow)" />
          <circle cx="75" cy="65" r="3.5" fill={logoColor} className="animate-pulse" filter="url(#glow)" />
          <circle cx="50" cy="50" r="4" fill={peaceSymbolColor} className="animate-pulse" filter="url(#glow)" />
          
          {/* Add subtle accent points */}
          <circle cx="33" cy="35" r="2.5" fill={secondaryColor} className="animate-pulse" />
          <circle cx="67" cy="35" r="2.5" fill={secondaryColor} className="animate-pulse" />
          <circle cx="33" cy="67" r="2.5" fill={secondaryColor} className="animate-pulse" />
          <circle cx="67" cy="67" r="2.5" fill={secondaryColor} className="animate-pulse" />
          
          {/* Filters for glow effects */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Enhanced hover effect */}
        <div className="absolute inset-0 bg-peacefulBlue opacity-0 rounded-full blur-xl group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110"></div>
      </div>
      
      {/* Brand name with slight shadow for better visibility */}
      <span className={`font-lora ${textSize} font-bold ${textColor} drop-shadow-sm`}>Peace2Hearts</span>
    </Link>
  );
};

export default CircuitHeartLogo;
