
// Core pricing fetcher/orchestrator
import { mapServicePricing, mapPackagePricing } from './pricingMapper';
import { hasTestService, fetchServicePricingFromDb, fetchPackagePricingFromDb } from './servicePriceFetcher';
import { getPricingCache, setPricingCache, clearPricingCache as clearCacheUtil } from './pricingCache';
export { formatPrice } from './priceFormatter';

/**
 * Fetch service pricing.
 */
export async function fetchServicePricing(
  serviceIds: string[] = [],
  skipCache = false
): Promise<Map<string, number>> {
  const cacheKey = `services-${serviceIds.sort().join('-')}`;
  if (!skipCache && !hasTestService(serviceIds)) {
    const cached = getPricingCache(cacheKey);
    if (cached) {
      console.log('Using cached pricing data for services:', serviceIds);
      return cached;
    }
  }

  const data = await fetchServicePricingFromDb(serviceIds);
  const pricingMap = mapServicePricing(data, serviceIds);
  setPricingCache(cacheKey, pricingMap);

  console.log('Final pricing map:', Object.fromEntries(pricingMap));
  return pricingMap;
}

/**
 * Fetch package pricing.
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
  const data = await fetchPackagePricingFromDb(packageIds);
  const pricingMap = mapPackagePricing(data, packageIds);
  setPricingCache(cacheKey, pricingMap);

  return pricingMap;
}

// Simple clear cache export
export function clearPricingCache() {
  clearCacheUtil();
}
