
import { getPackageName } from '@/utils/consultation/packageUtils';

type EffectivePriceState = {
  selectedServices: string[];
  pricing: Map<string, number> | undefined;
  totalPrice: number;
};

export const useEffectivePrice = (state: EffectivePriceState) => {
  return () => {
    // Log for debugging
    console.log("useEffectivePrice called with:", {
      selectedServices: state.selectedServices,
      pricing: state.pricing ? Object.fromEntries(state.pricing) : undefined,
      totalPrice: state.totalPrice
    });
    
    // Safety check for null/undefined input
    if (!state.selectedServices || !state.pricing) {
      console.log("useEffectivePrice: Missing required data, returning fallback price");
      return state.totalPrice > 0 ? state.totalPrice : 1500; // Fallback to 1500 if totalPrice is invalid
    }

    // Check for test service first (highest priority)
    if (state.selectedServices.includes('test-service')) {
      // If test service is in pricing map, use that price
      if (state.pricing?.has('test-service')) {
        const price = state.pricing.get('test-service') as number;
        console.log(`useEffectivePrice: Using test service price from pricing map: ${price}`);
        return price;
      }
      
      // If test service is selected but not in pricing map, use a fixed price for testing
      console.log("useEffectivePrice: Test service selected but not in pricing map, using fixed price of 11");
      return 11;
    }
    
    // Check for package first (packages take priority over individual services)
    const packageName = getPackageName(state.selectedServices);
    
    if (packageName) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      
      if (state.pricing?.has(packageId)) {
        const price = state.pricing.get(packageId) as number;
        console.log(`useEffectivePrice: Using package price for ${packageId}: ${price}`);
        return price > 0 ? price : 1500; // Fallback if price is invalid
      }
    }
    
    // For individual services
    if (state.selectedServices.length === 1) {
      const serviceId = state.selectedServices[0];
      if (state.pricing.has(serviceId)) {
        const price = state.pricing.get(serviceId) as number;
        console.log(`useEffectivePrice: Using price for service ${serviceId}: ${price}`);
        return price > 0 ? price : 1500; // Fallback if price is invalid
      } else {
        // If service ID not found in pricing map but we have a service selected
        console.log(`useEffectivePrice: Service ${serviceId} not found in pricing map, using fallback`);
        return 1500; // Reasonable fallback price for services
      }
    }
    
    // Fallback to totalPrice with validation
    const finalPrice = state.totalPrice > 0 ? state.totalPrice : 1500;
    console.log(`useEffectivePrice: Using fallback price: ${finalPrice}`);
    return finalPrice;
  };
};
