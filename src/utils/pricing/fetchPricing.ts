
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
  expandClientToDbPackageIds,
  mapDbToClientId
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
  
  console.log('fetchServicePricing called with:', { serviceIds, skipCache });
  
  if (!skipCache && !hasTestService) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('Using cached pricing data for services:', serviceIds);
      return cached;
    }
  }

  const data = await fetchServicePricingData(serviceIds);
  console.log('Raw service pricing data from DB:', data);
  
  const pricingMap = mapServicePricing(data, serviceIds);
  console.log('Mapped service pricing:', Object.fromEntries(pricingMap));
  
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
  console.log('fetchPackagePricing called with:', { packageIds, skipCache });
  
  if (!packageIds || packageIds.length === 0) {
    console.log('No package IDs provided, returning empty map');
    return new Map();
  }
  
  const cacheKey = `packages-${packageIds.sort().join('-')}`;
  
  if (!skipCache) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('Using cached pricing data for packages:', packageIds);
      return cached;
    }
  }

  const data = await fetchPackagePricingData(packageIds);
  console.log('Raw package pricing data from DB:', data);
  
  const pricingMap = mapPackagePricing(data, packageIds);
  console.log('Mapped package pricing:', Object.fromEntries(pricingMap));
  
  setPricingCache(cacheKey, pricingMap);
  return pricingMap;
}
