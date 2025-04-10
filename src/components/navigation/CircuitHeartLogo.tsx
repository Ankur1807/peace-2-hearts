
import React from 'react';
import { Link } from 'react-router-dom';

interface CircuitHeartLogoProps {
  className?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  animationClass?: string; // New prop to customize the animation
}

const CircuitHeartLogo: React.FC<CircuitHeartLogoProps> = ({ 
  className = '',
  textColor = 'text-white',
  size = 'md',
  animationClass = 'strong-heartbeat-glow' // Default animation
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
  const accentColor = "#D946EF"; // vividPink for additional accents
  const tertiaryColor = "#8B5CF6"; // vibrantPurple
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
          className={`w-full h-full ${animationClass}`}
        >
          {/* Base heart shadow layer */}
          <path 
            d="M50 92C47 92 44 91 41 89C27 81 7 60 7 33C7 19 18 8 32 8C40 8 47 12 50 18C53 12 60 8 68 8C82 8 93 19 93 33C93 60 73 81 59 89C56 91 53 92 50 92Z" 
            fill={shadowColor}
            transform="translate(3, 3)"
          />
          
          {/* Decorative outer ring */}
          <circle cx="50" cy="50" r="42" stroke={tertiaryColor} strokeWidth="1.5" strokeDasharray="4 2" fill="transparent" />
          
          {/* Main heart with glow animation */}
          <path 
            d="M50 90C47.5 90 45 89 42.5 87.5C30 80 10 60 10 35C10 22.5 20 12.5 32.5 12.5C40 12.5 46.25 16.25 50 22.5C53.75 16.25 60 12.5 67.5 12.5C80 12.5 90 22.5 90 35C90 60 70 80 57.5 87.5C55 89 52.5 90 50 90Z" 
            stroke={logoColor} 
            strokeWidth="4"
            fill="rgba(14, 165, 233, 0.15)"
          />
          
          {/* Inner decorative pattern */}
          <circle cx="50" cy="50" r="30" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" fill="transparent" />
          
          {/* Peace symbol in the center */}
          <circle cx="50" cy="50" r="20" stroke={peaceSymbolColor} strokeWidth="2.5" fill="transparent" />
          
          {/* Peace symbol lines */}
          {/* Vertical line */}
          <path d="M50 30 L50 70" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Left diagonal line */}
          <path d="M50 50 L35 65" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Right diagonal line */}
          <path d="M50 50 L65 65" stroke={peaceSymbolColor} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Connection points */}
          <circle cx="50" cy="50" r="3" fill={peaceSymbolColor} />
          
          {/* Additional decorative elements */}
          {/* Small accent circles along the heart outline */}
          <circle cx="20" cy="35" r="2" fill={secondaryColor} />
          <circle cx="80" cy="35" r="2" fill={secondaryColor} />
          <circle cx="30" cy="25" r="2" fill={tertiaryColor} />
          <circle cx="70" cy="25" r="2" fill={tertiaryColor} />
          <circle cx="25" cy="70" r="2" fill={accentColor} />
          <circle cx="75" cy="70" r="2" fill={accentColor} />
          <circle cx="50" cy="15" r="2" fill={logoColor} />
          <circle cx="50" cy="85" r="2" fill={logoColor} />
          
          {/* Energy lines radiating from center */}
          <path d="M50 50 L30 35" stroke={tertiaryColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
          <path d="M50 50 L70 35" stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
          <path d="M50 50 L40 80" stroke={secondaryColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
          <path d="M50 50 L60 80" stroke={secondaryColor} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
        </svg>

        {/* Enhanced hover effect */}
        <div className="absolute inset-0 bg-peacefulBlue opacity-0 rounded-full blur-xl group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110"></div>
      </div>
      
      {/* Brand name */}
      <span className={`font-lora ${textSize} font-bold ${textColor} drop-shadow-sm`}>Peace2Hearts</span>
    </Link>
  );
};

export default CircuitHeartLogo;
