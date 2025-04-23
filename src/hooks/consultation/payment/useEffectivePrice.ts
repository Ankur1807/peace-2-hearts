import { useCallback } from 'react';

interface UseEffectivePriceProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
  totalPrice?: number;
}

export const useEffectivePrice = ({
  selectedServices,
  pricing,
  totalPrice
}: UseEffectivePriceProps) => {
  const getEffectivePrice = useCallback(() => {
    // If a totalPrice is explicitly provided, use it
    if (totalPrice !== undefined && totalPrice > 0) {
      return totalPrice;
    }
    
    // Otherwise calculate from pricing map
    if (!selectedServices.length || !pricing) return 0;
    
    const serviceId = selectedServices[0];
    const price = pricing.get(serviceId);
    
    console.log('Getting price for service:', {
      serviceId,
      price,
      pricingMap: pricing ? Object.fromEntries(pricing) : {}
    });

    return price || 0;
  }, [selectedServices, pricing, totalPrice]);

  return getEffectivePrice;
};
