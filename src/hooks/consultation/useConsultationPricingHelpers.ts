
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    // Special handling for test service - fetch explicitly
    if (selectedServices.includes('test-service')) {
      console.log('Fetching pricing specifically for test service');
      pricingMap = await fetchServicePricing(['test-service'], true); // Force skip cache
      const testServicePrice = pricingMap.get('test-service');
      
      console.log(`Test service price from database: ${testServicePrice}`);
      
      if (testServicePrice && testServicePrice > 0) {
        finalPrice = testServicePrice;
        console.log(`Using test service price from database: ${finalPrice}`);
      } else {
        // Always set a default price for test service if not found in database
        const defaultTestPrice = 11;
        console.warn(`Test service price not found in database, using default price: ${defaultTestPrice}`);
        pricingMap.set('test-service', defaultTestPrice);
        finalPrice = defaultTestPrice;
      }
      
      console.log(`Final test service price: ${finalPrice}, Pricing map:`, Object.fromEntries(pricingMap));
      return { pricingMap, finalPrice };
    }

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
    
    // Even in case of errors, ensure test service has a price
    if (selectedServices.includes('test-service')) {
      const defaultTestPrice = 11;
      console.log(`Setting default test service price due to error: ${defaultTestPrice}`);
      pricingMap.set('test-service', defaultTestPrice);
      finalPrice = defaultTestPrice;
    }
    
    return { pricingMap, finalPrice };
  }
}
