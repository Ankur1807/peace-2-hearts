
import { mapServicePricing, mapPackagePricing, getPricingCache, setPricingCache } from './core/pricingService';
import { fetchServicePricingData, fetchPackagePricingData } from './core/pricingService';
export { clearPricingCache, formatPrice } from './core/pricingService';

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
  
  if (!skipCache && !hasTestService) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('Using cached pricing data for services:', serviceIds);
      return cached;
    }
  }

  const data = await fetchServicePricingData(serviceIds);
  const pricingMap = mapServicePricing(data, serviceIds);
  setPricingCache(cacheKey, pricingMap);

  console.log('Final pricing map:', Object.fromEntries(pricingMap));
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
  const cacheKey = `packages-${packageIds.sort().join('-')}`;
  if (!skipCache) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('Using cached pricing data for packages:', packageIds);
      return cached;
    }
  }
  const data = await fetchPackagePricingData(packageIds);
  const pricingMap = mapPackagePricing(data, packageIds);
  setPricingCache(cacheKey, pricingMap);

  return pricingMap;
}
