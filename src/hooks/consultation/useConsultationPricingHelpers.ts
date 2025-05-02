
import { getPackageName } from '@/utils/consultation/packageUtils';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing';
import { mapClientToDbId } from '@/utils/consultation/serviceIdMapper';

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
        'pre-marriage-legal',
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
      
      console.log('Service pricing data:', Object.fromEntries(servicePricing));
      console.log('Package pricing data:', Object.fromEntries(packagePricing));
      
      // Combine pricing maps
      pricingMap = new Map([...servicePricing, ...packagePricing]);
      console.log('Combined pricing map:', Object.fromEntries(pricingMap));
    } catch (err) {
      console.error('Error loading initial pricing data:', err);
      // Continue execution to handle selected services
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

    console.log(`Final price calculated: ${finalPrice}, Pricing map has ${pricingMap.size} items`);
    return { pricingMap, finalPrice };
  } catch (error) {
    console.error('Error calculating pricing:', error);
    setPricingError('Failed to calculate pricing');
    return { pricingMap, finalPrice };
  }
}
