
import { supabase } from '@/integrations/supabase/client';
import { fetchServicePricingData, fetchAllServiceData } from './pricingQueries';
import { mapServicePricing, mapPackagePricing } from './pricingMapper';
import { calculatePackagePrice } from './pricingCalculator';
import { formatPrice } from './priceFormatter';
import { expandClientToDbPackageIds } from './serviceIdMapper';

/**
 * Fetch pricing for services
 * @param serviceIds - Optional array of service IDs to fetch 
 * @returns Map of service_id to price
 */
export async function fetchServicePricing(serviceIds?: string[]): Promise<Map<string, number>> {
  try {
    console.log('Fetching service pricing for:', serviceIds);
    
    // Fetch service pricing data
    const data = await fetchServicePricingData(serviceIds);
    
    // Map database data to client-side pricing map
    const pricingMap = mapServicePricing(data, serviceIds);
    
    // If no data was found, log available services for debugging
    if (pricingMap.size === 0 && serviceIds && serviceIds.length > 0) {
      console.warn('No active pricing data found for the requested services:', serviceIds);
      
      try {
        const allServices = await fetchAllServiceData();
        console.log('All available services in database:', allServices.map(s => s.service_id));
      } catch (allError) {
        console.error('Failed to fetch all services for debugging:', allError);
      }
    }
    
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchServicePricing:', error);
    // Return empty map on error
    return new Map<string, number>();
  }
}

/**
 * Fetch pricing for packages
 * @param packageIds - Optional array of package IDs to fetch
 * @param skipCache - Whether to skip using cached data
 * @returns Map of package_id to price
 */
export async function fetchPackagePricing(packageIds?: string[], skipCache: boolean = false): Promise<Map<string, number>> {
  try {
    console.log('Fetching package pricing for:', packageIds, 'skipCache:', skipCache);
    
    if (!packageIds || packageIds.length === 0) {
      return new Map<string, number>();
    }
    
    // Create a map of package_id to price
    const pricingMap = new Map<string, number>();
    
    // Add cache-busting parameter when needed
    const cacheParam = skipCache ? `?_t=${Date.now()}` : '';
    
    // First try to get package pricing from the package_pricing table
    try {
      const expandedIds = expandClientToDbPackageIds(packageIds);
      
      if (expandedIds.length > 0) {
        const { data, error } = await supabase
          .from('service_pricing')
          .select('service_id, price, is_active')
          .eq('type', 'package')
          .in('service_id', expandedIds)
          .eq('is_active', true);
          
        if (error) {
          console.error('Error fetching from service_pricing table (packages):', error);
        } else if (data && data.length > 0) {
          console.log('Found package pricing in service_pricing table:', data);
          
          // Map the data to our pricing map
          const packagePricingMap = mapPackagePricing(data, packageIds);
          
          // Merge into the main pricing map
          packagePricingMap.forEach((price, id) => {
            pricingMap.set(id, price);
          });
        }
      }
    } catch (packageTableError) {
      console.log('Failed to fetch package pricing:', packageTableError);
    }
    
    // If we still don't have pricing information for the requested packages,
    // calculate based on component services as a last resort
    if (pricingMap.size === 0 && packageIds && packageIds.length > 0) {
      for (const packageId of packageIds) {
        const packagePrice = await calculatePackagePrice(packageId);
        
        if (packagePrice > 0) {
          pricingMap.set(packageId, packagePrice);
        }
      }
    }
    
    console.log('Final package pricing map:', Object.fromEntries(pricingMap));
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchPackagePricing:', error);
    return new Map<string, number>();
  }
}

// Re-export price formatter for convenience
export { formatPrice };
