
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing';

export async function calculatePricingMap(selectedServices, serviceCategory, setPricingError, toast) {
  let pricingMap: Map<string, number> = new Map();
  let finalPrice = 0;

  try {
    console.log(`Calculating pricing for services: ${selectedServices.join(', ')}`);
    
    // Load initial pricing data for all services to ensure prices are shown on the form
    // This runs regardless of service selection to populate the pricing dropdown
    try {
      const mentalHealthIds = [
        'mental-health-counselling', 
        'family-therapy', 
        'premarital-counselling-individual',
        'premarital-counselling-couple',
        'couples-counselling',
        'sexual-health-counselling'
      ];
      
      const legalIds = [
        'mediation',
        'divorce',
        'custody',
        'maintenance',
        'general-legal'
      ];
      
      const packageIds = [
        'divorce-prevention',
        'pre-marriage-clarity'
      ];
      
      console.log('Fetching all service and package pricing data');
      
      // Load all pricing data regardless of selection to populate the form
      const [servicePricing, packagePricing] = await Promise.all([
        fetchServicePricing([...mentalHealthIds, ...legalIds]),
        fetchPackagePricing(packageIds)
      ]);
      
      console.log('[PRICE DEBUG] Service pricing data:', Object.fromEntries(servicePricing));
      console.log('[PRICE DEBUG] Package pricing data:', Object.fromEntries(packagePricing));
      console.log('[PRICE DEBUG] Divorce prevention package price:', packagePricing.get('divorce-prevention'));
      
      // Combine pricing maps
      pricingMap = new Map([...servicePricing, ...packagePricing]);
      console.log('[PRICE DEBUG] Combined pricing map:', Object.fromEntries(pricingMap));
      console.log('[PRICE DEBUG] Divorce prevention price in combined map:', pricingMap.get('divorce-prevention'));
    } catch (err) {
      console.error('[PRICE DEBUG] Error loading initial pricing data:', err);
      // Continue execution to handle selected services
    }
    
    // Standard handling for all other services
    // Check if selected services match a package
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      // Use service ID instead of comparing package name strings
      const packageId = selectedServices.includes('divorce-prevention')
        ? 'divorce-prevention'
        : 'pre-marriage-clarity';
          
      console.log(`[PRICE DEBUG] Services match package: ${packageName} (${packageId})`);
      
      try {
        // First get all individual prices
        const servicePricing = await fetchServicePricing(selectedServices);
        pricingMap = new Map([...pricingMap, ...servicePricing]);
        
        // Then try to get package price
        const packagePricing = await fetchPackagePricing([packageId]);
        console.log('[PRICE DEBUG] Package pricing fetch result:', Object.fromEntries(packagePricing));
        console.log('[PRICE DEBUG] Divorce prevention package price:', packagePricing.get(packageId));
        
        if (packagePricing.has(packageId)) {
          // If package has price, use it
          finalPrice = packagePricing.get(packageId)!;
          pricingMap.set(packageId, finalPrice);
          console.log(`[PRICE DEBUG] Using package price: ${finalPrice} for ${packageId}`);
        } else {
          console.warn(`[PRICE WARNING] No price found for package ${packageId}`);
          // No fallback price, just set to 0
          finalPrice = 0;
        }
      } catch (err) {
        console.error("[PRICE DEBUG] Error processing package pricing:", err);
        setPricingError('Error calculating package pricing');
      }
    } else if (selectedServices.length > 0) {
      // Regular services
      try {
        // Get prices for selected services
        const selectedServicePricing = await fetchServicePricing(selectedServices);
        
        // Update the pricing map with these prices
        selectedServicePricing.forEach((price, id) => {
          pricingMap.set(id, price);
        });
        
        if (selectedServices.length === 1) {
          const serviceId = selectedServices[0];
          if (pricingMap.has(serviceId)) {
            finalPrice = pricingMap.get(serviceId)!;
            console.log(`[PRICE DEBUG] Single service price for ${serviceId}: ${finalPrice}`);
          } else {
            console.warn(`[PRICE WARNING] No price found for service ${serviceId}`);
            finalPrice = 0;
          }
        } else {
          let calculatedTotal = 0;
          selectedServices.forEach((serviceId) => {
            if (pricingMap.has(serviceId)) {
              const price = pricingMap.get(serviceId)!;
              calculatedTotal += price;
            } else {
              console.warn(`[PRICE WARNING] No price found for service ${serviceId}`);
            }
          });
          finalPrice = calculatedTotal;
          console.log(`[PRICE DEBUG] Combined services price: ${finalPrice}`);
        }
      } catch (err) {
        console.error("[PRICE DEBUG] Error fetching service pricing:", err);
        setPricingError('Error retrieving service pricing');
      }
    }

    console.log(`[PRICE DEBUG] Final price calculated: ${finalPrice}, Pricing map has ${pricingMap.size} items`);
    console.log('[PRICE DEBUG] Final pricing map:', Object.fromEntries(pricingMap));
    return { pricingMap, finalPrice };
  } catch (error) {
    console.error('[PRICE DEBUG] Error calculating pricing:', error);
    setPricingError('Failed to calculate pricing');
    return { pricingMap, finalPrice };
  }
}
