
/**
 * In-memory pricing cache (was in fetchPricing).
 */
type PricingCache = Record<string, { data: Map<string, number>; timestamp: number }>;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let pricingCache: PricingCache = {};

export function getPricingCache(key: string): Map<string, number> | null {
  if (pricingCache[key]) {
    if (Date.now() - pricingCache[key].timestamp < CACHE_TTL) {
      return pricingCache[key].data;
    }
  }
  return null;
}

export function setPricingCache(key: string, data: Map<string, number>) {
  pricingCache[key] = { data, timestamp: Date.now() };
}

export function clearPricingCache() {
  pricingCache = {};
  console.log('Pricing cache cleared');
}
