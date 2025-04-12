
import React from 'react';
import HeartLogoSvg from './HeartLogoSvg';

interface HeartLogoWrapperProps {
  svgSize: string;
  animationClass?: string;
}

const HeartLogoWrapper: React.FC<HeartLogoWrapperProps> = ({ 
  svgSize, 
  animationClass = 'strong-heartbeat-glow'
}) => {
  return (
    <div className={`${svgSize} relative group drop-shadow-lg`}>
      {/* Drop shadow for the entire logo */}
      <div className="absolute inset-0 opacity-40 blur-md bg-peacefulBlue rounded-full -z-10 transform scale-90"></div>
      
      {/* The SVG Heart Logo */}
      <HeartLogoSvg animationClass={animationClass} />

      {/* Enhanced hover effect */}
      <div className="absolute inset-0 bg-peacefulBlue opacity-0 rounded-full blur-xl group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110"></div>
    </div>
  );
};

export default HeartLogoWrapper;
