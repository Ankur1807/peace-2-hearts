
import { useEffect } from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';

interface UseEffectivePriceProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
  totalPrice?: number;
}

export const useEffectivePrice = ({ selectedServices, pricing, totalPrice = 0 }: UseEffectivePriceProps) => {
  // Detailed debug logs to trace price calculation
  useEffect(() => {
    console.log('[PRICE DEBUG] useEffectivePrice - Inputs:', { 
      selectedServices: selectedServices.join(', '), 
      pricing: pricing ? Object.fromEntries(pricing) : 'none', 
      totalPrice 
    });

    if (selectedServices.includes('divorce-prevention')) {
      console.log('[PRICE DEBUG] Divorce prevention service selected');
      console.log('[PRICE DEBUG] Divorce prevention price in pricing map:', pricing?.get('divorce-prevention'));
    }
    if (selectedServices.includes('pre-marriage-clarity')) {
      console.log('[PRICE DEBUG] Pre-marriage clarity service selected');
      console.log('[PRICE DEBUG] Pre-marriage clarity price in pricing map:', pricing?.get('pre-marriage-clarity'));
    }

    const packageName = selectedServices.length > 0 ? getPackageName(selectedServices) : null;
    if (packageName) {
      const packageId = selectedServices.includes('divorce-prevention') ? 'divorce-prevention' : 
                        selectedServices.includes('pre-marriage-clarity') ? 'pre-marriage-clarity' : null;
      console.log(`[PRICE DEBUG] Package detected: ${packageName} (${packageId})`);
      if (packageId) {
        console.log(`[PRICE DEBUG] Package price in pricing map: ${pricing?.get(packageId)}`);
      }
    }
  }, [selectedServices, pricing, totalPrice]);

  // Return a function that calculates the effective price
  return () => {
    // Check if this is a package first
    const packageName = selectedServices.length > 0 ? getPackageName(selectedServices) : null;
    
    if (packageName) {
      // Use ID-based identification
      const packageId = selectedServices.includes('divorce-prevention') 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      
      // Get price directly from pricing map if available
      if (pricing && pricing.has(packageId)) {
        const price = pricing.get(packageId)!;
        console.log(`[PRICE DEBUG] useEffectivePrice returning package price: ${price} for ${packageId}`);
        return price;
      }
      
      console.log(`[PRICE DEBUG] Package price not found in map, using 0`);
      return 0;
    }
    
    // For single service
    if (selectedServices.length === 1) {
      const serviceId = selectedServices[0];
      if (pricing && pricing.has(serviceId)) {
        const price = pricing.get(serviceId)!;
        console.log(`[PRICE DEBUG] useEffectivePrice returning single service price: ${price} for ${serviceId}`);
        return price;
      }
      
      console.log(`[PRICE DEBUG] Service price not found, returning 0 for ${serviceId}`);
      return 0;
    }
    
    console.log(`[PRICE DEBUG] useEffectivePrice: No specific price found, returning 0`);
    return 0;
  };
};
