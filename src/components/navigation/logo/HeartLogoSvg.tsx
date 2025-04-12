
import React from 'react';
import { logoColors } from '@/components/logo/LogoDrawer';

interface HeartLogoSvgProps {
  animationClass?: string;
}

const HeartLogoSvg: React.FC<HeartLogoSvgProps> = ({ 
  animationClass = 'strong-heartbeat-glow' 
}) => {
  // Use the same colors as in LogoDrawer
  const { logoColor, peaceSymbolColor, secondaryColor, accentColor, tertiaryColor, shadowColor } = logoColors;

  return (
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
      
      {/* Main heart with glow animation */}
      <path 
        d="M50 90C47.5 90 45 89 42.5 87.5C30 80 10 60 10 35C10 22.5 20 12.5 32.5 12.5C40 12.5 46.25 16.25 50 22.5C53.75 16.25 60 12.5 67.5 12.5C80 12.5 90 22.5 90 35C90 60 70 80 57.5 87.5C55 89 52.5 90 50 90Z" 
        stroke={logoColor} 
        strokeWidth="4"
        fill="rgba(14, 165, 233, 0.15)"
      />
      
      {/* Sparkle pattern instead of inner circle */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
        const dist = 30;
        const x = 50 + Math.cos(angle * Math.PI/180) * dist;
        const y = 50 + Math.sin(angle * Math.PI/180) * dist;
        const size = index % 3 === 0 ? 2.5 : 1.8;
        const color = index % 3 === 0 ? accentColor : (index % 3 === 1 ? secondaryColor : logoColor);
        
        // Star shape
        const points = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        let starPath = "";
        
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i / (points * 2)) * Math.PI * 2;
          const starX = x + Math.cos(angle) * radius;
          const starY = y + Math.sin(angle) * radius;
          
          starPath += (i === 0 ? "M" : "L") + starX + "," + starY;
        }
        starPath += "Z";
        
        return (
          <path 
            key={`star-${index}`}
            d={starPath}
            fill={color}
            opacity="0.8"
          />
        );
      })}
      
      {/* Peace symbol circle */}
      <circle cx="50" cy="50" r="20" stroke={peaceSymbolColor} strokeWidth="2.5" fill="transparent" />
      
      {/* Central white dot where branches emerge from */}
      <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
      
      {/* Tree branch peace symbol lines with gradients and curves */}
      {/* Vertical branch */}
      <path 
        d="M50,30 C52,40 48,60 50,70" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Left diagonal branch - connecting to heart edge */}
      <path 
        d="M50,50 C45,55 40,58 35,65" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Right diagonal branch - connecting to heart edge */}
      <path 
        d="M50,50 C55,55 60,58 65,65" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Small leaf buds on branches */}
      <circle cx="51" cy="40" r="0.8" fill="#A3F2BE" />
      <circle cx="49" cy="55" r="0.8" fill="#A3F2BE" />
      <circle cx="42" cy="58" r="0.8" fill="#A3F2BE" />
      <circle cx="58" cy="58" r="0.8" fill="#A3F2BE" />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2FCE2" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>
      
      {/* Additional decorative elements - stars */}
      {[
        {x: 20, y: 35, color: secondaryColor, size: 2.5},
        {x: 80, y: 35, color: secondaryColor, size: 2.5},
        {x: 30, y: 25, color: tertiaryColor, size: 2.5},
        {x: 70, y: 25, color: tertiaryColor, size: 2.5},
        {x: 25, y: 70, color: accentColor, size: 2.5},
        {x: 75, y: 70, color: accentColor, size: 2.5},
        {x: 50, y: 13, color: logoColor, size: 2.5},
        {x: 50, y: 83, color: logoColor, size: 2.5}
      ].map((star, index) => {
        const points = 5;
        const outerRadius = star.size;
        const innerRadius = star.size * 0.4;
        let starPath = "";
        
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i / (points * 2)) * Math.PI * 2;
          const starX = star.x + Math.cos(angle) * radius;
          const starY = star.y + Math.sin(angle) * radius;
          
          starPath += (i === 0 ? "M" : "L") + starX + "," + starY;
        }
        starPath += "Z";
        
        return (
          <path 
            key={`accent-star-${index}`}
            d={starPath}
            fill={star.color}
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
};

export default HeartLogoSvg;
