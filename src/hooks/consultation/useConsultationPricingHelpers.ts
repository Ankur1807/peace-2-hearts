import { fetchPackagePricing, fetchServicePricing } from '@/utils/pricing';
import { ToastAction } from '@/components/ui/toast';
import { getPackageName } from '@/utils/consultation/packageUtils';

export async function calculatePricingMap(
  selectedServices: string[],
  serviceCategory: string,
  setPricingError: (error: string | null) => void,
  toast: any
): Promise<{ pricingMap: Map<string, number>, finalPrice: number }> {
  try {
    // Initialize an empty pricing map
    const pricingMap = new Map<string, number>();
    
    // Check if there's a holistic package selected
    const packageName = getPackageName(selectedServices);
    
    // Use the package ID from selectedServices if it's a package
    if (packageName) {
      // Determine package ID based on selected services
      const packageId = selectedServices.includes('divorce-prevention') ? 'divorce-prevention' : 
                        selectedServices.includes('pre-marriage-clarity') ? 'pre-marriage-clarity' : null;
                        
      if (packageId) {
        console.log(`[PRICE DEBUG] Fetching pricing for package: ${packageId}`);
        const packagePricing = await fetchPackagePricing([packageId], true); // Skip cache
        
        // Merge package pricing into the pricing map
        if (packagePricing.size > 0) {
          for (const [id, price] of packagePricing.entries()) {
            pricingMap.set(id, price);
            console.log(`[PRICE DEBUG] Added package price: ${id} = ${price}`);
          }
        } else {
          console.warn(`[PRICE WARNING] No pricing found for package: ${packageId}`);
        }
      }
    } 
    // Otherwise, fetch individual service pricing
    else if (selectedServices.length > 0) {
      console.log(`[PRICE DEBUG] Fetching pricing for services: ${selectedServices.join(', ')}`);
      const servicePricing = await fetchServicePricing(selectedServices, true); // Skip cache
      
      // Merge service pricing into the pricing map
      if (servicePricing.size > 0) {
        for (const [id, price] of servicePricing.entries()) {
          pricingMap.set(id, price);
          console.log(`[PRICE DEBUG] Added service price: ${id} = ${price}`);
        }
      } else {
        console.warn(`[PRICE WARNING] No pricing found for services: ${selectedServices.join(', ')}`);
      }
    }
    
    // Calculate the final price based on the selected services/package
    let finalPrice = 0;
    
    if (packageName && selectedServices[0]) {
      const packageId = selectedServices[0];
      finalPrice = pricingMap.get(packageId) || 0;
      console.log(`[PRICE DEBUG] Using package price for ${packageId}: ${finalPrice}`);
    } else if (selectedServices.length === 1) {
      finalPrice = pricingMap.get(selectedServices[0]) || 0;
      console.log(`[PRICE DEBUG] Using service price for ${selectedServices[0]}: ${finalPrice}`);
    }
    
    console.log(`[PRICE DEBUG] Final calculated price: ${finalPrice}`);
    
    if (finalPrice === 0 && selectedServices.length > 0) {
      console.warn(`[PRICE WARNING] No price found for selected services/package`);
      // Set error but don't provide fallback price - let UI handle missing price
      setPricingError('No pricing information available for the selected service');
    } else {
      setPricingError(null);
    }
    
    return { pricingMap, finalPrice };
  } catch (error) {
    console.error('[PRICE ERROR] Error calculating pricing map:', error);
    setPricingError('Failed to calculate pricing information');
    toast({
      title: "Error retrieving pricing data",
      description: "Please try again later or contact support.",
      variant: "destructive",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
    return { pricingMap: new Map<string, number>(), finalPrice: 0 };
  }
}
