
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

    // Check if selection is a package ID directly
    if (selectedServices.length === 1 && 
        (selectedServices[0] === 'divorce-prevention' || 
         selectedServices[0] === 'pre-marriage-clarity')) {
      
      const packageId = selectedServices[0];
      console.log(`Direct package selection: ${packageId}`);
      
      try {
        // Fetch package pricing
        const packagePricing = await fetchPackagePricing([packageId]);
        if (packagePricing.has(packageId)) {
          finalPrice = packagePricing.get(packageId)!;
          pricingMap.set(packageId, finalPrice);
          console.log(`Found direct package price: ${finalPrice} for ${packageId}`);
        }
      } catch (err) {
        console.error(`Error fetching direct package price for ${packageId}:`, err);
      }
      
      // Also get individual service prices for reference
      try {
        const individualPrices = await fetchServicePricing();
        pricingMap = new Map([...pricingMap, ...individualPrices]);
      } catch (err) {
        console.error("Error fetching individual service prices:", err);
      }
      
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
          
      console.log(`Services match package: ${packageName} (${packageId})`);
      
      try {
        // First get all individual prices
        const servicePricing = await fetchServicePricing(selectedServices);
        pricingMap = new Map([...pricingMap, ...servicePricing]);
        
        // Then try to get package price
        const packagePricing = await fetchPackagePricing([packageId]);
        
        if (packagePricing.has(packageId)) {
          // If package has price, use it
          finalPrice = packagePricing.get(packageId)!;
          pricingMap.set(packageId, finalPrice);
          console.log(`Using package price: ${finalPrice}`);
        } else {
          // Calculate from individual services with discount
          let sum = 0;
          selectedServices.forEach((serviceId) => {
            const price = servicePricing.get(serviceId) || 0;
            sum += price;
          });
          
          if (sum > 0) {
            // Apply 15% discount for packages
            finalPrice = Math.round(sum * 0.85);
            pricingMap.set(packageId, finalPrice);
            console.log(`Calculated discounted price: ${finalPrice} (15% off ${sum})`);
          }
        }
      } catch (err) {
        console.error("Error processing package pricing:", err);
        setPricingError('Error calculating package pricing');
      }
    } else {
      // Regular services
      try {
        pricingMap = await fetchServicePricing(selectedServices);
        
        if (selectedServices.length === 1) {
          const serviceId = selectedServices[0];
          finalPrice = pricingMap.get(serviceId) || 0;
          console.log(`Single service price for ${serviceId}: ${finalPrice}`);
        } else {
          selectedServices.forEach((serviceId) => {
            const price = pricingMap.get(serviceId) || 0;
            finalPrice += price;
          });
          console.log(`Combined services price: ${finalPrice}`);
        }
      } catch (err) {
        console.error("Error fetching service pricing:", err);
        setPricingError('Error retrieving service pricing');
      }
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
