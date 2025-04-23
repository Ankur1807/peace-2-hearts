
import React from 'react';

const SideWaves: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side wavey lines, reduced group opacity for subtle accent */}
      <svg 
        className="absolute left-0 h-full w-16 md:w-20 lg:w-24" 
        viewBox="0 0 100 800" 
        preserveAspectRatio="none" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.2 }}
      >
        <g>
          <path 
            d="M0,800 C15,700 -5,600 15,500 C30,400 0,300 15,200 C25,100 5,0 30,0 L0,0 L0,800 Z" 
            fill="url(#leftWaveGradient)" 
            fillOpacity="1"
          />
          <path 
            d="M0,800 C20,750 5,650 20,550 C35,450 5,350 20,250 C30,150 10,50 35,0 L0,0 L0,800 Z" 
            fill="url(#leftWaveGradientAlt)" 
            fillOpacity="1"
          />
        </g>
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

      {/* Right side wavey lines, reduced group opacity */}
      <svg 
        className="absolute right-0 h-full w-16 md:w-20 lg:w-24" 
        viewBox="0 0 100 800" 
        preserveAspectRatio="none" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.2 }}
      >
        <g>
          <path 
            d="M100,800 C85,700 105,600 85,500 C70,400 100,300 85,200 C75,100 95,0 70,0 L100,0 L100,800 Z" 
            fill="url(#rightWaveGradient)" 
            fillOpacity="1"
          />
          <path 
            d="M100,800 C80,750 95,650 80,550 C65,450 95,350 80,250 C70,150 90,50 65,0 L100,0 L100,800 Z" 
            fill="url(#rightWaveGradientAlt)" 
            fillOpacity="1"
          />
        </g>
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

