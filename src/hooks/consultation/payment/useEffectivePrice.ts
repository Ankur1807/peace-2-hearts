
import { useCallback } from 'react';

interface UseEffectivePriceParams {
  selectedServices?: string[];
  pricing?: Map<string, number>;
  totalPrice?: number;
}

export function useEffectivePrice({
  selectedServices = [],
  pricing,
  totalPrice = 0
}: UseEffectivePriceParams) {

  const getEffectivePrice = useCallback(() => {
    if (!pricing || pricing.size === 0) {
      return totalPrice;
    }

    if (selectedServices.length === 0) {
      return 0;
    }

    // Handle test service for development - use pricing database value only
    if (selectedServices.includes('test-service')) {
      const testServicePrice = pricing.get('test-service');
      if (testServicePrice !== undefined && testServicePrice > 0) {
        return testServicePrice; // Return the actual price from pricing map
      }
      return 0; // No fallback price
    }

    // Try to find the price from the pricing map
    for (const serviceId of selectedServices) {
      const price = pricing.get(serviceId);
      if (price !== undefined && price > 0) {
        return price;
      }
    }

    // Fall back to total price if available
    return totalPrice;
  }, [selectedServices, pricing, totalPrice]);

  return getEffectivePrice;
}
