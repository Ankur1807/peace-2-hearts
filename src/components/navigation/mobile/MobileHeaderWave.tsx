
const MobileHeaderWave = () => {
  return (
    <svg 
      className="w-full h-6 absolute bottom-0 translate-y-full" 
      viewBox="0 0 1440 60" 
      fill="none" 
      preserveAspectRatio="none"
    >
      <path 
        d="M0 20C240 35 480 5 720 15C960 25 1200 40 1440 30V60H0V20Z" 
        fill="#8B5CF6" 
        fillOpacity="0.8"
      />
      <path 
        d="M0 10C240 0 480 25 720 20C960 15 1200 0 1440 5V60H0V10Z" 
        fill="#8B5CF6" 
        fillOpacity="0.4"
      />
    </svg>
  );
};

export default MobileHeaderWave;
