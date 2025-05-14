
import React from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';

export function useConsultationPricingDebug(totalPrice, selectedServices, pricing) {
  React.useEffect(() => {
    // Only log when there's meaningful information to display
    if (selectedServices.length > 0) {
      console.log(`PRICING DEBUG - Current totalPrice: ${totalPrice}, Selected services: ${selectedServices.join(', ')}`);
      
      // Log all available prices in the pricing map for debugging
      if (pricing && pricing.size > 0) {
        console.log('PRICING DEBUG - Available pricing data:', Object.fromEntries(pricing));
      } else {
        console.log('PRICING DEBUG - No pricing data available in the map');
      }

      if (selectedServices.length === 1) {
        const serviceId = selectedServices[0];
        const servicePrice = pricing.get(serviceId);
        console.log(`PRICING DEBUG - Single service selected: ${serviceId}, Price: ${servicePrice !== undefined ? servicePrice : 'not found'}`);
      }

      const packageName = getPackageName(selectedServices);
      if (packageName) {
        const packageId =
          packageName === 'Divorce Prevention Package'
            ? 'divorce-prevention'
            : 'pre-marriage-clarity';
        const packagePrice = pricing.get(packageId);
        console.log(`PRICING DEBUG - Selected package: ${packageName} (${packageId}), Price: ${packagePrice !== undefined ? packagePrice : 'not found'}`);
      }
    }
  }, [totalPrice, selectedServices, pricing]);
}
