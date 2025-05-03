
import React, { useEffect } from 'react';
import { getServiceLabel } from '@/utils/consultationLabels';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { formatPrice } from '@/utils/pricing';

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
  
  // Debug pricing information
  useEffect(() => {
    console.log("PricingSection rendering with:", {
      selectedServices,
      pricingAvailable: !!pricing,
      pricingSize: pricing ? pricing.size : 0,
      totalPrice
    });
    
    if (pricing && pricing.size > 0) {
      console.log("Available prices:", Object.fromEntries(pricing));
    }
  }, [selectedServices, pricing, totalPrice]);
  
  // Check if the selected services match a package
  const packageName = getPackageName(selectedServices);
  // Use service ID instead of comparing package name strings
  const packageId = packageName ? 
    (selectedServices.includes('divorce-prevention') ? 'divorce-prevention' : 
     selectedServices.includes('pre-marriage-clarity') ? 'pre-marriage-clarity' : null) : null;
  
  // Get appropriate package price if it's a package
  const packagePrice = packageId && pricing && pricing.has(packageId) 
    ? pricing.get(packageId)! 
    : 0; // No fallback, use 0 if not found
  
  // For individual services, use the direct price from the pricing map
  const servicePrice = selectedServices.length === 1 && pricing && pricing.has(selectedServices[0])
    ? pricing.get(selectedServices[0])!
    : 0; // No fallback, use 0 if not found
  
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
      
      {packageName && (
        // If it's a package, show the package name and price
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 font-medium">{packageName}</span>
            <span className="font-medium">
              {packagePrice > 0 
                ? formatPrice(packagePrice)
                : "Price unavailable"}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>This package includes:</p>
            <ul className="list-disc pl-5 mt-1">
              {selectedServices.map(serviceId => (
                <li key={serviceId}>{getServiceLabel(serviceId)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {!packageName && selectedServices.length > 0 && (
        // If it's individual services, show each service and its price
        <div className="space-y-2 mb-6">
          {selectedServices.map(serviceId => {
            const price = pricing?.get(serviceId) || 0;
            return (
              <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{getServiceLabel(serviceId)}</span>
                <span className="font-medium">
                  {price > 0 
                    ? formatPrice(price)
                    : "Price unavailable"}
                </span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-300">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-xl font-bold text-peacefulBlue">
          {(packageName && packagePrice > 0) || (!packageName && servicePrice > 0) 
            ? formatPrice(packageName ? packagePrice : servicePrice)
            : "Price unavailable"}
        </span>
      </div>
    </div>
  );
};

export default PricingSection;
