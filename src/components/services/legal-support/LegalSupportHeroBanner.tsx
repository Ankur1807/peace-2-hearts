
import React from 'react';
import { Scale, Gavel, Handshake } from 'lucide-react';

interface LegalSupportHeroBannerProps {
  serviceType?: 'divorce' | 'mediation' | 'custody' | 'maintenance' | 'general';
  className?: string;
}

const LegalSupportHeroBanner: React.FC<LegalSupportHeroBannerProps> = ({ 
  serviceType = 'general', 
  className = '' 
}) => {
  // Determine which illustration to render based on serviceType
  const renderIllustration = () => {
    switch(serviceType) {
      case 'divorce':
        return <DivorceIllustration />;
      case 'mediation':
        return <MediationIllustration />;
      case 'custody':
        return <CustodyIllustration />;
      case 'maintenance':
        return <MaintenanceIllustration />;
      case 'general':
      default:
        return <GeneralLegalIllustration />;
    }
  };
  
  return (
    <div className={`relative w-full h-full min-h-[250px] sm:min-h-[300px] overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-peacefulBlue/5 to-paleYellow/15 z-0"></div>
      <div className="absolute inset-0 z-10">
        {renderIllustration()}
      </div>
    </div>
  );
};

// Individual illustrations for each legal service type
const GeneralLegalIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/3 w-24 sm:w-40 h-24 sm:h-40 bg-peacefulBlue/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/3 right-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-paleYellow/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Legal scale symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 md:w-32 sm:h-24 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/20 to-paleYellow/20 flex items-center justify-center animate-wave">
            <Scale className="w-10 h-10 sm:w-14 md:w-18 sm:h-14 md:h-18 text-peacefulBlue animate-heartbeat-glow" />
          </div>
          <div className="absolute -top-2 -left-2 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-peacefulBlue/20 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-paleYellow/20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}></div>
        </div>
      </div>
      
      {/* Document elements */}
      <div className="absolute top-1/3 right-1/3 transform rotate-6">
        <div className="w-10 sm:w-12 h-12 sm:h-16 bg-white/60 rounded shadow-sm flex items-center justify-center animate-wave" style={{ animationDuration: '4s' }}>
          <div className="w-6 sm:w-8 h-1 bg-gray-300/60 mb-2"></div>
          <div className="w-6 sm:w-8 h-1 bg-gray-300/60 mb-2"></div>
          <div className="w-4 sm:w-6 h-1 bg-gray-300/60"></div>
        </div>
      </div>
      
      <div className="absolute bottom-1/3 left-1/4 transform -rotate-12">
        <div className="w-8 sm:w-10 h-10 sm:h-14 bg-white/50 rounded shadow-sm animate-wave" style={{ animationDuration: '3.5s', animationDelay: '0.7s' }}></div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-paleYellow/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const DivorceIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/3 w-40 h-40 bg-softPink/5 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-peacefulBlue/5 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.6s' }}></div>
      
      {/* Gavel icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/20 to-vibrantPurple/5 flex items-center justify-center animate-wave">
            <Gavel className="w-14 h-14 md:w-18 md:h-18 text-peacefulBlue/80 animate-heartbeat-glow" />
          </div>
        </div>
      </div>
      
      {/* Separate circle elements representing separation */}
      <div className="absolute top-1/3 left-1/4">
        <div className="w-16 h-16 rounded-full bg-peacefulBlue/15 flex items-center justify-center animate-wave" style={{ animationDuration: '3.5s' }}>
          <div className="w-8 h-8 rounded-full bg-peacefulBlue/30"></div>
        </div>
      </div>
      
      <div className="absolute bottom-1/3 right-1/4">
        <div className="w-16 h-16 rounded-full bg-vibrantPurple/15 flex items-center justify-center animate-wave" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <div className="w-8 h-8 rounded-full bg-vibrantPurple/30"></div>
        </div>
      </div>
      
      {/* Document element */}
      <div className="absolute top-1/3 right-1/3 transform rotate-12">
        <div className="w-12 h-16 bg-white/40 rounded shadow-sm animate-wave" style={{ animationDuration: '4.5s' }}>
          <div className="h-full w-1/2 border-r border-dashed border-gray-400/30"></div>
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/10 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-vibrantPurple/10 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/15 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const MediationIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-peacefulBlue/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-softGreen/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.7s' }}></div>
      
      {/* Central mediation symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/20 to-softGreen/20 flex items-center justify-center animate-wave">
          <Scale className="w-14 h-14 md:w-18 md:h-18 text-peacefulBlue animate-heartbeat-glow" />
        </div>
      </div>
      
      {/* Two figures with connector */}
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 flex justify-between items-center">
        {/* Figure 1 */}
        <div className="w-12 h-12 rounded-full bg-peacefulBlue/20 animate-bounce" style={{ animationDuration: '3s' }}></div>
        
        {/* Connector - dotted line */}
        <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-peacefulBlue to-softGreen" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, currentColor 50%)', backgroundSize: '8px 1px' }}></div>
        
        {/* Figure 2 */}
        <div className="w-12 h-12 rounded-full bg-softGreen/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Document elements */}
      <div className="absolute top-1/3 left-1/3 transform -rotate-6">
        <div className="w-10 h-14 bg-white/40 rounded shadow-sm animate-wave" style={{ animationDuration: '4s' }}></div>
      </div>
      
      <div className="absolute top-1/3 right-1/3 transform rotate-6">
        <div className="w-10 h-14 bg-white/40 rounded shadow-sm animate-wave" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}></div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-softGreen/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const CustodyIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-softPink/5 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-peacefulBlue/5 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.4s' }}></div>
      
      {/* Main legal scale */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/20 to-softPink/10 flex items-center justify-center animate-wave">
            <Scale className="w-14 h-14 md:w-18 md:h-18 text-peacefulBlue/80 animate-heartbeat-glow" />
          </div>
        </div>
      </div>
      
      {/* Family representation */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex items-end space-x-4">
        {/* Adult figure */}
        <div className="w-10 h-16 rounded-t-full bg-peacefulBlue/20 flex items-start justify-center">
          <div className="w-6 h-6 rounded-full bg-peacefulBlue/40 mt-1"></div>
        </div>
        
        {/* Child figure */}
        <div className="w-8 h-12 rounded-t-full bg-softPink/20 flex items-start justify-center">
          <div className="w-4 h-4 rounded-full bg-softPink/40 mt-1"></div>
        </div>
      </div>
      
      {/* Document with heart */}
      <div className="absolute top-1/3 right-1/3 transform rotate-6">
        <div className="w-14 h-18 bg-white/40 rounded shadow-sm flex items-center justify-center animate-wave" style={{ animationDuration: '4s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-softPink/30">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
          </svg>
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-softPink/15 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/15 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const MaintenanceIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/3 w-36 h-36 bg-paleYellow/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-peacefulBlue/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Financial support symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/20 to-paleYellow/15 flex items-center justify-center animate-wave">
            <Scale className="w-14 h-14 md:w-18 md:h-18 text-peacefulBlue/70 animate-heartbeat-glow" />
          </div>
        </div>
      </div>
      
      {/* Document with currency symbol */}
      <div className="absolute top-1/3 left-1/3 transform -rotate-6">
        <div className="w-14 h-18 bg-white/40 rounded shadow-sm flex items-center justify-center animate-wave" style={{ animationDuration: '4s' }}>
          <span className="text-paleYellow font-bold text-xl">₹</span>
        </div>
      </div>
      
      {/* House symbol */}
      <div className="absolute bottom-1/3 right-1/3">
        <div className="w-20 h-16 flex flex-col items-center animate-wave" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}>
          <div className="w-14 h-8 bg-peacefulBlue/20 rounded-t-lg"></div>
          <div className="w-10 h-6 border-l-4 border-r-4 border-b-4 border-peacefulBlue/20 rounded-b"></div>
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-paleYellow/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-peacefulBlue/15 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/15 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

export default LegalSupportHeroBanner;
