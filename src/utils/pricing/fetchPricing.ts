
// Import from individual modules after refactoring
import { 
  mapServicePricing, 
  mapPackagePricing 
} from './core/pricingMapperService';
import { 
  getPricingCache, 
  setPricingCache 
} from './core/cacheService';
import { 
  fetchServicePricingData, 
  fetchPackagePricingData 
} from './core/pricingFetchService';
import {
  expandClientToDbPackageIds
} from './core/idMappingService';
export { 
  clearPricingCache, 
  formatPrice 
} from './core/pricingService';

/**
 * Fetch service pricing data.
 * @param serviceIds - Array of service IDs to fetch pricing for
 * @param skipCache - Flag to skip cache and fetch fresh data
 * @returns Map of service ID to price
 */
export async function fetchServicePricing(
  serviceIds: string[] = [],
  skipCache = false
): Promise<Map<string, number>> {
  const hasTestService = serviceIds.includes('test-service');
  const cacheKey = `services-${serviceIds.sort().join('-')}`;
  
  console.log('[PRICE DEBUG] fetchServicePricing called with:', { serviceIds, skipCache });
  
  if (!skipCache && !hasTestService) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('[PRICE DEBUG] Using cached pricing data for services:', serviceIds);
      console.log('[PRICE DEBUG] Cached pricing data:', Object.fromEntries(cached));
      return cached;
    }
  }

  const data = await fetchServicePricingData(serviceIds);
  console.log('[PRICE DEBUG] Raw service pricing data from DB:', data);
  
  const pricingMap = mapServicePricing(data, serviceIds);
  console.log('[PRICE DEBUG] Mapped service pricing:', Object.fromEntries(pricingMap));
  
  setPricingCache(cacheKey, pricingMap);
  return pricingMap;
}

/**
 * Fetch package pricing data.
 * @param packageIds - Array of package IDs to fetch pricing for
 * @param skipCache - Flag to skip cache and fetch fresh data
 * @returns Map of package ID to price
 */
export async function fetchPackagePricing(
  packageIds: string[] = [],
  skipCache = false
): Promise<Map<string, number>> {
  console.log('[PRICE DEBUG] fetchPackagePricing called with:', { packageIds, skipCache });
  
  if (!packageIds || packageIds.length === 0) {
    console.log('[PRICE DEBUG] No package IDs provided, returning empty map');
    return new Map<string, number>();
  }
  
  const cacheKey = `packages-${packageIds.sort().join('-')}`;
  if (!skipCache) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('[PRICE DEBUG] Using cached pricing data for packages:', packageIds);
      console.log('[PRICE DEBUG] Cached package pricing data:', Object.fromEntries(cached));
      return cached;
    }
  }
  
  try {
    // Expand the client IDs to DB IDs before fetching
    const expandedIds = expandClientToDbPackageIds(packageIds);
    console.log('[PRICE DEBUG] Expanded package IDs:', expandedIds);
    
    const data = await fetchPackagePricingData(packageIds);
    console.log('[PRICE DEBUG] Raw package pricing data from DB:', data);
    
    const pricingMap = mapPackagePricing(data, packageIds);
    console.log('[PRICE DEBUG] Mapped package pricing:', Object.fromEntries(pricingMap));
    
    setPricingCache(cacheKey, pricingMap);
    return pricingMap;
  } catch (error) {
    console.error('[PRICE DEBUG] Error in fetchPackagePricing:', error);
    // Return empty map on error
    return new Map<string, number>();
  }
}
