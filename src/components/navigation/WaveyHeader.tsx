
import { useIsMobile } from '@/hooks/use-mobile';

const WaveyHeader = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Static wave for mobile devices
    return (
      <div 
        className="absolute inset-0 w-full h-full z-[10] pointer-events-none bg-vibrantPurple overflow-hidden"
      >
        <svg 
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none" 
          height="15"
          viewBox="0 0 1440 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 20C240 35 480 5 720 15C960 25 1200 40 1440 30V40H0V20Z" fill="white" fillOpacity="0.15"/>
          <path d="M0 10C240 0 480 25 720 20C960 15 1200 0 1440 5V40H0V10Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>
    );
  }
  
  // Animated wave for desktop
  return (
    <svg 
      className="absolute inset-0 w-full h-full z-[10] pointer-events-none" 
      preserveAspectRatio="none" 
      viewBox="0 0 1440 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 80C240 100 480 40 720 40C960 40 1200 100 1440 90V120H0V80Z" fill="url(#header-wave1)" fillOpacity="0.3"/>
      <path d="M0 50C240 30 480 80 720 70C960 60 1200 30 1440 40V120H0V50Z" fill="url(#header-wave2)" fillOpacity="0.2"/>
      <defs>
        <linearGradient id="header-wave1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6"/>
          <stop offset="1" stopColor="#0EA5E9"/>
        </linearGradient>
        <linearGradient id="header-wave2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316"/>
          <stop offset="1" stopColor="#D946EF"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default WaveyHeader;
