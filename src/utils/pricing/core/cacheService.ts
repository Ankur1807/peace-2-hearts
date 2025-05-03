
// Cache management for pricing data
const pricingCache: Map<string, Map<string, number>> = new Map();

export function clearPricingCache(): void {
  pricingCache.clear();
  console.log('[PRICE DEBUG] Pricing cache cleared');
}

export function getPricingCache(key: string): Map<string, number> | undefined {
  const cached = pricingCache.get(key);
  if (cached) {
    console.log(`[PRICE DEBUG] Cache hit for key: ${key}`);
    console.log(`[PRICE DEBUG] Cached values:`, Object.fromEntries(cached));
  } else {
    console.log(`[PRICE DEBUG] Cache miss for key: ${key}`);
  }
  return cached;
}

export function setPricingCache(key: string, data: Map<string, number>): void {
  console.log(`[PRICE DEBUG] Caching data for key: ${key}`);
  console.log(`[PRICE DEBUG] Caching values:`, Object.fromEntries(data));
  pricingCache.set(key, data);
}
