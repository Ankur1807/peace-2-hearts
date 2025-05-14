import React from 'react';
import { Heart, Users, MessageSquare } from 'lucide-react';

interface MentalHealthHeroBannerProps {
  serviceType?: 'counselling' | 'family-therapy' | 'couples-counselling' | 'sexual-health-counselling';
  className?: string;
}

const MentalHealthHeroBanner: React.FC<MentalHealthHeroBannerProps> = ({ 
  serviceType = 'counselling',
  className = ''
}) => {
  // Determine which illustration to render based on serviceType
  const renderIllustration = () => {
    switch(serviceType) {
      case 'couples-counselling':
        return <CouplesCounsellingIllustration />;
      case 'family-therapy':
        return <FamilyTherapyIllustration />;
      case 'sexual-health-counselling':
        return <SexualHealthIllustration />;
      case 'counselling':
      default:
        return <CounsellingIllustration />;
    }
  };
  
  return (
    <div className={`relative w-full h-full min-h-[250px] sm:min-h-[300px] overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-peacefulBlue/10 to-vibrantPurple/20 z-0"></div>
      <div className="absolute inset-0 z-10">
        {renderIllustration()}
      </div>
    </div>
  );
};

// Individual illustrations for each service type
const CounsellingIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-peacefulBlue/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/4 right-1/4 w-28 sm:w-48 h-28 sm:h-48 bg-softPink/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Mind with heart icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 md:w-32 sm:h-24 md:h-32 rounded-full bg-gradient-to-br from-peacefulBlue/30 to-vibrantPurple/30 flex items-center justify-center animate-wave">
            <Heart className="w-10 h-10 sm:w-12 md:w-16 sm:h-12 md:h-16 text-peacefulBlue animate-heartbeat-glow" />
          </div>
          <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-softGreen/30 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-softPink/30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}></div>
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-vibrantPurple/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const CouplesCounsellingIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-peacefulBlue/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/3 right-1/6 w-40 h-40 bg-softPink/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.7s' }}></div>
      
      {/* Two figures representation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4 md:space-x-8">
        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-peacefulBlue/50 to-peacefulBlue/20 flex items-center justify-center animate-wave" style={{ animationDuration: '4s' }}>
            <Users className="w-10 h-10 md:w-14 md:h-14 text-peacefulBlue animate-heartbeat-glow" />
          </div>
        </div>
        
        {/* Connection line */}
        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-peacefulBlue to-vibrantPurple animate-pulse"></div>
        
        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-vibrantPurple/50 to-vibrantPurple/20 flex items-center justify-center animate-wave" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <Heart className="w-10 h-10 md:w-14 md:h-14 text-vibrantPurple animate-heartbeat-glow" />
          </div>
        </div>
      </div>
      
      {/* Message bubbles */}
      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-peacefulBlue/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="w-6 h-6 rounded-full bg-peacefulBlue/40"></div>
        </div>
      </div>
      <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
        <div className="w-8 h-8 rounded-full bg-vibrantPurple/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>
          <div className="w-4 h-4 rounded-full bg-vibrantPurple/40"></div>
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-vibrantPurple/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-lightBlue/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const FamilyTherapyIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-softGreen/10 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-peacefulBlue/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.6s' }}></div>
      
      {/* Family group representation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-end">
        {/* Adult figure 1 */}
        <div className="relative mx-2">
          <div className="w-12 h-20 md:w-16 md:h-24 rounded-t-full bg-peacefulBlue/50 flex items-start justify-center animate-wave" style={{ animationDuration: '4s' }}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-peacefulBlue/70 mt-1"></div>
          </div>
        </div>
        
        {/* Child figure */}
        <div className="relative mx-2 mb-4">
          <div className="w-8 h-14 md:w-10 md:h-16 rounded-t-full bg-softGreen/50 flex items-start justify-center animate-wave" style={{ animationDuration: '3s', animationDelay: '0.2s' }}>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-softGreen/70 mt-1"></div>
          </div>
        </div>
        
        {/* Adult figure 2 */}
        <div className="relative mx-2">
          <div className="w-12 h-20 md:w-16 md:h-24 rounded-t-full bg-vibrantPurple/50 flex items-start justify-center animate-wave" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-vibrantPurple/70 mt-1"></div>
          </div>
        </div>
      </div>
      
      {/* Heart connecting the family */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Heart className="w-12 h-12 text-peacefulBlue/40 animate-heartbeat-glow" />
      </div>
      
      {/* Users icon for family representation */}
      <div className="absolute bottom-1/4 right-1/4">
        <div className="w-16 h-16 rounded-full bg-softPink/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
          <Users className="w-10 h-10 text-softPink/60" />
        </div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-softGreen/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-vibrantPurple/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

const SexualHealthIllustration = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-full h-full">
      {/* Background elements */}
      <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-softPink/15 rounded-full animate-pulse-fractal"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-lightBlue/10 rounded-full animate-pulse-fractal" style={{ animationDelay: '0.4s' }}></div>
      
      {/* Two hearts representation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* First heart */}
          <div className="absolute -left-12 -top-12 transform -rotate-12">
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <Heart className="w-full h-full text-softPink/60 animate-heartbeat-glow" />
            </div>
          </div>
          
          {/* Second heart */}
          <div className="absolute left-4 top-2 transform rotate-12">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Heart className="w-full h-full text-peacefulBlue/60 animate-heartbeat-glow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Connection element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Message icon for communication */}
      <div className="absolute bottom-1/3 left-1/5">
        <div className="w-14 h-14 rounded-full bg-peacefulBlue/20 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
          <MessageSquare className="w-8 h-8 text-peacefulBlue/60" />
        </div>
      </div>
      
      {/* Floating circles */}
      <div className="absolute top-1/5 right-1/4">
        <div className="w-10 h-10 rounded-full bg-vibrantPurple/20 animate-bounce" style={{ animationDuration: '4s' }}></div>
      </div>
      <div className="absolute bottom-1/4 right-1/6">
        <div className="w-6 h-6 rounded-full bg-softPink/30 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.2s' }}></div>
      </div>
      
      {/* Wave patterns */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-softPink/20 animate-wave" style={{ animationDelay: '0s' }}></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-peacefulBlue/20 animate-wave" style={{ animationDelay: '0.5s' }}></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-vibrantPurple/20 animate-wave" style={{ animationDelay: '1s' }}></path>
      </svg>
    </div>
  </div>
);

export default MentalHealthHeroBanner;
