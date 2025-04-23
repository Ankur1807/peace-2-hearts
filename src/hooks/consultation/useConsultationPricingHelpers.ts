
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    console.log(`Calculating pricing for services: ${selectedServices.join(', ')}`);
    
    // Special case for test service - fetch directly first
    if (selectedServices.includes('test-service')) {
      console.log("Test service selected, fetching its price");
      const testServicePricing = await fetchServicePricing(['test-service'], true); // Skip cache
      
      if (testServicePricing.has('test-service')) {
        const testPrice = testServicePricing.get('test-service') as number;
        console.log(`Retrieved test service price: ${testPrice}`);
        pricingMap.set('test-service', testPrice);
        finalPrice = testPrice;
        
        // Return early since we don't need to process packages for test service
        return { pricingMap, finalPrice };
      } else {
        console.log("Test service price not found in direct fetch");
      }
    }
    
    // Standard handling for all other services
    // Check if selected services match a package
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      const packageId =
        packageName === 'Divorce Prevention Package'
          ? 'divorce-prevention'
          : 'pre-marriage-clarity';
      const packagePricing = await fetchPackagePricing([packageId]);
      finalPrice = packagePricing.get(packageId) || 0;

      if (finalPrice > 0) {
        pricingMap.set(packageId, finalPrice);
        const servicePricing = await fetchServicePricing(selectedServices);
        pricingMap = new Map([...pricingMap, ...servicePricing]);
      } else {
        pricingMap = await fetchServicePricing(selectedServices);
        selectedServices.forEach((serviceId) => {
          const price = pricingMap.get(serviceId) || 0;
          finalPrice += price;
        });
        if (finalPrice > 0) {
          finalPrice = Math.round(finalPrice * 0.85);
          pricingMap.set(packageId, finalPrice);
        }
      }
    } else {
      pricingMap = await fetchServicePricing(selectedServices);
      selectedServices.forEach((serviceId) => {
        const price = pricingMap.get(serviceId) || 0;
        finalPrice += price;
      });
    }

    console.log(`Final price calculated: ${finalPrice}, Pricing map:`, Object.fromEntries(pricingMap));
    return { pricingMap, finalPrice };
  } catch (error) {
    console.error('Error calculating pricing:', error);
    setPricingError('Failed to calculate pricing');
    return { pricingMap, finalPrice };
  }
}
