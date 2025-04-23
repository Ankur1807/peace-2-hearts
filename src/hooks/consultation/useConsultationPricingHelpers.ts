
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    console.log(`Calculating pricing for services: ${selectedServices.join(', ')}`);
    
    // Standard handling for all services (including test service)
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

    // Check if we have a valid price, especially for test service
    if (finalPrice <= 0 && selectedServices.includes('test-service') && pricingMap.has('test-service')) {
      finalPrice = pricingMap.get('test-service') || 0;
      console.log(`Using test service price directly: ${finalPrice}`);
    }

    console.log(`Final price calculated: ${finalPrice}, Pricing map:`, Object.fromEntries(pricingMap));
    return { pricingMap, finalPrice };
  } catch (error) {
    console.error('Error calculating pricing:', error);
    setPricingError('Failed to calculate pricing');
    return { pricingMap, finalPrice };
  }
}
