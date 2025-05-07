
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

  // Mapping from legacy client IDs to Supabase-aligned IDs
  const legacyIdMap: Record<string, string> = {
    'divorce-prevention': 'P2H-H-divorce-prevention-package',
    'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
    'couples-counselling': 'P2H-MH-couples-counselling',
    'family-therapy': 'P2H-MH-family-therapy',
    'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
    'mental-health-counselling': 'P2H-MH-mental-health-counselling',
    'test-service': 'P2H-MH-test-service',
    'mediation': 'P2H-L-mediation-services',
    'maintenance': 'P2H-L-maintenance-consultation',
    'custody': 'P2H-L-child-custody-consultation',
    'divorce': 'P2H-L-divorce-consultation',
    'general-legal': 'P2H-L-general-legal-consultation'
  };

  const getEffectivePrice = useCallback(() => {
    if (!pricing || pricing.size === 0) {
      return totalPrice;
    }

    if (selectedServices.length === 0) {
      return 0;
    }

    // Handle test service for development - FIXED: preserve the actual price (11)
    if (selectedServices.includes('test-service')) {
      // Try first with legacy mapping
      const testServiceId = legacyIdMap['test-service'] || 'test-service';
      const testServicePrice = pricing.get(testServiceId);
      if (testServicePrice !== undefined && testServicePrice > 0) {
        return testServicePrice; // Return the actual price from pricing map
      }
      return 11; // Default fallback price for test service
    }

    // Try to find the price from the pricing map with legacy ID conversion
    for (const serviceId of selectedServices) {
      // Check if it's a legacy ID that needs to be mapped to Supabase ID
      const supabaseId = legacyIdMap[serviceId] || serviceId;
      const price = pricing.get(supabaseId);
      
      if (price !== undefined && price > 0) {
        console.log(`Found price for ${serviceId} (mapped to ${supabaseId}): ₹${price}`);
        return price;
      }
    }

    // Fall back to total price if available
    return totalPrice;
  }, [selectedServices, pricing, totalPrice, legacyIdMap]);

  return getEffectivePrice;
}
