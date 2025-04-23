import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    // Special handling for test service - always set a fixed price regardless of DB
    if (selectedServices.includes('test-service')) {
      console.log('Test service detected, setting fixed price of 11');
      // Always set a fixed price for test service
      const testPrice = 11;
      pricingMap.set('test-service', testPrice);
      finalPrice = testPrice;
      
      console.log(`Final test service price: ${finalPrice}, Pricing map:`, Object.fromEntries(pricingMap));
      return { pricingMap, finalPrice };
    }

    // Standard handling for other services (unchanged)
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
    
    // Even in case of errors for test service, ensure it has a fixed price
    if (selectedServices.includes('test-service')) {
      const testPrice = 11;
      console.log(`Setting fixed test service price due to error: ${testPrice}`);
      pricingMap.set('test-service', testPrice);
      finalPrice = testPrice;
    }
    
    return { pricingMap, finalPrice };
  }
}
