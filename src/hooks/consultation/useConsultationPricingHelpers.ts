
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    console.log(`Calculating pricing for services: ${selectedServices.join(', ')}`);
    
    // Special case for test service - set a hardcoded price first as fallback
    if (selectedServices.includes('test-service')) {
      console.log("Test service selected, using hardcoded price as fallback");
      pricingMap.set('test-service', 11);
      finalPrice = 11;
    }
    
    // Try to fetch from database even for test service (might override the hardcoded price if available)
    if (selectedServices.includes('test-service')) {
      console.log("Test service selected, fetching its price");
      try {
        const testServicePricing = await fetchServicePricing(['test-service'], true); // Skip cache
        
        if (testServicePricing.has('test-service')) {
          const testPrice = testServicePricing.get('test-service') as number;
          console.log(`Retrieved test service price from DB: ${testPrice}`);
          pricingMap.set('test-service', testPrice);
          finalPrice = testPrice;
        } else {
          console.log("Test service price not found in DB, using fallback price: 11");
        }
      } catch (err) {
        console.log("Error fetching test service price, using fallback:", err);
        // Keep fallback price already set above
      }
      
      // Return early since we don't need to process packages for test service
      return { pricingMap, finalPrice };
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
    
    // Set fallback pricing for test service even in case of errors
    if (selectedServices.includes('test-service')) {
      pricingMap.set('test-service', 11);
      finalPrice = 11;
    }
    
    return { pricingMap, finalPrice };
  }
}
