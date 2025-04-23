
import { useCallback } from 'react';

interface UseEffectivePriceProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
}

export const useEffectivePrice = ({
  selectedServices,
  pricing
}: UseEffectivePriceProps) => {
  const getEffectivePrice = useCallback(() => {
    if (!selectedServices.length || !pricing) return 0;
    
    const serviceId = selectedServices[0];
    const price = pricing.get(serviceId);
    
    console.log('Getting price for service:', {
      serviceId,
      price,
      pricingMap: Object.fromEntries(pricing)
    });

    return price || 0;
  }, [selectedServices, pricing]);

  return getEffectivePrice;
};
