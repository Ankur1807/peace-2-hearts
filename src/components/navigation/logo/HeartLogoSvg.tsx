
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

  // --- 9 Star positions, adjusted so all stars are inside the heart and around the peace symbol ---
  const starCount = 9;
  const starRadius = 25; // Reduced radius so all stars are inside the heart, tightly ringed around the peace symbol
  const center = 50;
  const starColors = [
    accentColor, secondaryColor, logoColor, 
    tertiaryColor, accentColor, secondaryColor, 
    tertiaryColor, accentColor, logoColor
  ];
  const starEls = [];
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 - Math.PI/2;
    const x = center + Math.cos(angle) * starRadius;
    const y = center + Math.sin(angle) * starRadius;
    const size = 2.6;
    const color = starColors[i % starColors.length];
    // Star path logic
    const points = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let starPath = "";
    for (let j = 0; j < points * 2; j++) {
      const r = j % 2 === 0 ? outerRadius : innerRadius;
      const ptAngle = -Math.PI/2 + (j / (points * 2)) * Math.PI * 2;
      const starX = x + Math.cos(ptAngle) * r;
      const starY = y + Math.sin(ptAngle) * r;
      starPath += (j === 0 ? "M" : "L") + starX + "," + starY;
    }
    starPath += "Z";
    starEls.push(
      <path 
        key={`star-${i}`} 
        d={starPath}
        fill={color}
        opacity="0.87"
      />
    );
  }

  // Precise coordinates for the peace symbol circle so it is tangent (touches) to the heart’s interior at top and bottom.
  // On inspection, for a 80x80px heart centered at (50,50), a circle of radius ~30 centered at (50, 54) is best fit.
  // Diagonals should start/stop inside this circle. The vertical branch from (50,22) [the top pointed edge of heart] to (50,54)
  // Diagonals from (50,54) to (50-17,54+21) and (50+17,54+21), endpoints stay within the circle.

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

      {/* 9 stars inside the heart, circular pattern around peace symbol */}
      {starEls}

      {/* Peace symbol circle fits snugly inside heart, slightly below center for more symmetry */}
      <circle cx="50" cy="54" r="30" stroke={peaceSymbolColor} strokeWidth="2.5" fill="transparent" />
      
      {/* Tree branch peace symbol lines with gradients and curves */}
      {/* Vertical branch: from pointed top of heart to center */}
      <path 
        d="M50,22 L50,54" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Left diagonal branch - stays inside peace symbol circle */}
      <path 
        d="M50,54 L33,75" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Right diagonal branch - stays inside peace symbol circle */}
      <path 
        d="M50,54 L67,75" 
        stroke="url(#branchGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Small leaf buds on branches */}
      <circle cx="50" cy="41" r="0.8" fill="#A3F2BE" />
      <circle cx="47" cy="61" r="0.8" fill="#A3F2BE" />
      <circle cx="53" cy="61" r="0.8" fill="#A3F2BE" />
      <circle cx="40" cy="70" r="0.8" fill="#A3F2BE" />
      <circle cx="60" cy="70" r="0.8" fill="#A3F2BE" />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2FCE2" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>
      
      {/* Central white dot where branches emerge from */}
      <circle cx="50" cy="54" r="3.5" fill="#FFFFFF" />
    </svg>
  );
};

export default HeartLogoSvg;
