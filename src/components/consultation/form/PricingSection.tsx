
import React from 'react';
import { getServiceLabel } from '@/utils/consultationLabels';

interface PricingSectionProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
  totalPrice: number;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  selectedServices,
  pricing,
  totalPrice
}) => {
  // No need to show pricing if no services are selected
  if (selectedServices.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-gradient-to-r from-peacefulBlue/5 to-white rounded-lg border border-peacefulBlue/20 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-peacefulBlue">
          <path d="M2.5 20v-1.5a2.5 2.5 0 0 1 2.5-2.5h0a2.5 2.5 0 0 1 2.5 2.5v1.5"/>
          <path d="M2.5 20h6.5"/>
          <path d="M16.5 20v-1.5a2.5 2.5 0 0 0-2.5-2.5h0a2.5 2.5 0 0 0-2.5 2.5v1.5"/>
          <path d="M15 20h6.5"/>
          <path d="M8 15h8"/>
          <circle cx="12" cy="8" r="5"/>
        </svg>
        Consultation Summary
      </h3>
      
      <div className="space-y-2 mb-6">
        {selectedServices.map(serviceId => {
          const price = pricing?.get(serviceId) || 0;
          return (
            <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">{getServiceLabel(serviceId)}</span>
              <span className="font-medium">₹{price.toLocaleString('en-IN')}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-300">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-xl font-bold text-peacefulBlue">₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export default PricingSection;
