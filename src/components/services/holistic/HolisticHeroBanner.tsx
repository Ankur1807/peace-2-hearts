
import React from 'react';
import { Bridge, Heart, MessageCircle, Users, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

type HolisticServiceType = 'divorce-prevention' | 'pre-marriage-clarity';

interface HolisticHeroBannerProps {
  serviceType: HolisticServiceType;
  className?: string;
}

const HolisticHeroBanner = ({ serviceType, className }: HolisticHeroBannerProps) => {
  return (
    <div className={cn("relative w-full h-full min-h-[250px] sm:min-h-[350px] overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-blue-50", className)}>
      {serviceType === 'divorce-prevention' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Bridge/Light connection between couple */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
              <div className="w-full h-1 bg-gradient-to-r from-peacefulBlue/20 via-peacefulBlue/60 to-peacefulBlue/20 animate-pulse"></div>
              <Bridge className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-peacefulBlue w-12 h-12 animate-heartbeat-glow" />
            </div>
            
            {/* Couple */}
            <div className="w-full flex justify-between px-8 relative z-10">
              <div className="flex flex-col items-center">
                <div className="bg-vibrantPurple/10 rounded-full p-4 mb-2">
                  <Users className="w-12 h-12 text-vibrantPurple animate-spin-very-slow" />
                </div>
                <div className="h-16 w-1 bg-gradient-to-b from-vibrantPurple/50 to-transparent"></div>
              </div>
              
              {/* Guide/Support figure */}
              <div className="flex flex-col items-center">
                <div className="bg-peacefulBlue/10 rounded-full p-4 mb-2 translate-y-8">
                  <Handshake className="w-12 h-12 text-peacefulBlue animate-spin-very-slow" />
                </div>
                <div className="h-16 w-1 bg-gradient-to-b from-peacefulBlue/50 to-transparent"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-gradient-to-br from-vibrantPurple/10 to-peacefulBlue/5 animate-spin-slower"></div>
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-tl from-peacefulBlue/10 to-vibrantPurple/5 animate-spin-reverse-slow"></div>
          </div>
        </div>
      )}
      
      {serviceType === 'pre-marriage-clarity' && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Two individuals with overlapping thought/heart bubbles */}
            <div className="w-full flex justify-around px-8 relative z-10">
              {/* First person with thought bubble */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="bg-peacefulBlue/10 rounded-full p-4 mb-2">
                    <Users className="w-10 h-10 text-peacefulBlue" />
                  </div>
                  <div className="absolute -top-4 -right-2">
                    <div className="relative">
                      <MessageCircle className="w-8 h-8 text-peacefulBlue/70 fill-peacefulBlue/10 animate-heartbeat-glow" />
                      <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-peacefulBlue" />
                    </div>
                  </div>
                </div>
                <div className="h-16 w-1 bg-gradient-to-b from-peacefulBlue/50 to-transparent"></div>
              </div>
              
              {/* Second person with heart bubble */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="bg-vibrantPurple/10 rounded-full p-4 mb-2">
                    <Users className="w-10 h-10 text-vibrantPurple" />
                  </div>
                  <div className="absolute -top-4 -left-2">
                    <div className="relative">
                      <Heart className="w-8 h-8 text-vibrantPurple/70 fill-vibrantPurple/10 animate-heartbeat-glow" />
                      <MessageCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-vibrantPurple" />
                    </div>
                  </div>
                </div>
                <div className="h-16 w-1 bg-gradient-to-b from-vibrantPurple/50 to-transparent"></div>
              </div>
            </div>
            
            {/* Overlapping circles in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-peacefulBlue/20 absolute -left-6 -top-8 animate-pulse"></div>
                <div className="w-16 h-16 rounded-full bg-vibrantPurple/20 absolute -right-6 -top-8 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-vibrantPurple/10 to-peacefulBlue/5 animate-spin-slower"></div>
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gradient-to-tl from-peacefulBlue/10 to-vibrantPurple/5 animate-spin-reverse-slow"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolisticHeroBanner;
