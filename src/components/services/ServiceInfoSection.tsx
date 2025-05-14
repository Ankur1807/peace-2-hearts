
import React, { ReactNode } from 'react';
import SimpleMandalaPattern from '../mandala/SimpleMandalaPattern';
import { cn } from "@/lib/utils";

interface ServiceInfoItem {
  text: string;
}

interface ServiceInfoSectionProps {
  whoCanBenefit: ServiceInfoItem[];
  howItWorks: ServiceInfoItem[];
  mandalaColor?: string;
  whoCanBenefitClassName?: string;
  howItWorksClassName?: string;
  isDivorcePage?: boolean;
}

const ServiceInfoSection = ({ 
  whoCanBenefit, 
  howItWorks, 
  mandalaColor = "bg-peacefulBlue/5",
  whoCanBenefitClassName,
  howItWorksClassName,
  isDivorcePage = false
}: ServiceInfoSectionProps) => {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Mandala Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-[150%] md:w-[120%] lg:w-[100%] aspect-square rounded-full ${mandalaColor} opacity-70`}>
          <div className="w-full h-full animate-spin-very-slow">
            <SimpleMandalaPattern isHovered={false} animated={true} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative z-10">
          
          {/* Who Can Benefit Card */}
          <div className={cn(
            "rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 text-center",
            isDivorcePage ? 
              (whoCanBenefitClassName || "bg-white") : 
              (whoCanBenefitClassName || "bg-gradient-2")
          )}>
            <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">
              {isDivorcePage ? "Who Can Benefit" : "Who is this for?"}
            </h2>
            <ul className="space-y-4">
              {whoCanBenefit.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-peacefulBlue text-sm">•</span>
                  </div>
                  <p className="text-gray-700 text-left">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* How It Works Card */}
          <div className={cn(
            "rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 text-center",
            isDivorcePage ? 
              (howItWorksClassName || "bg-white") : 
              (howItWorksClassName || "bg-gradient-3")
          )}>
            <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">How It Works</h2>
            <ol className="space-y-4">
              {howItWorks.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue flex items-center justify-center text-white font-medium mr-3">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-left">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceInfoSection;
