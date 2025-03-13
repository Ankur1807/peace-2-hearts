
import React from 'react';

const SideWaves: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side wavey lines */}
      <svg 
        className="absolute left-0 h-full w-24 md:w-32 lg:w-40" 
        viewBox="0 0 100 800" 
        preserveAspectRatio="none" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0,800 C20,700 -10,600 20,500 C40,400 0,300 20,200 C30,100 10,0 40,0 L0,0 L0,800 Z" 
          fill="url(#leftWaveGradient)" 
          fillOpacity="0.1"
        />
        <path 
          d="M0,800 C30,750 10,650 30,550 C50,450 10,350 30,250 C40,150 20,50 50,0 L0,0 L0,800 Z" 
          fill="url(#leftWaveGradientAlt)" 
          fillOpacity="0.08"
        />
        <defs>
          <linearGradient id="leftWaveGradient" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="leftWaveGradientAlt" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right side wavey lines */}
      <svg 
        className="absolute right-0 h-full w-24 md:w-32 lg:w-40" 
        viewBox="0 0 100 800" 
        preserveAspectRatio="none" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M100,800 C80,700 110,600 80,500 C60,400 100,300 80,200 C70,100 90,0 60,0 L100,0 L100,800 Z" 
          fill="url(#rightWaveGradient)" 
          fillOpacity="0.1"
        />
        <path 
          d="M100,800 C70,750 90,650 70,550 C50,450 90,350 70,250 C60,150 80,50 50,0 L100,0 L100,800 Z" 
          fill="url(#rightWaveGradientAlt)" 
          fillOpacity="0.08"
        />
        <defs>
          <linearGradient id="rightWaveGradient" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="rightWaveGradientAlt" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SideWaves;
