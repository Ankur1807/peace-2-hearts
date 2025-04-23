
// Cache management for pricing data
const pricingCache: Map<string, Map<string, number>> = new Map();

export function clearPricingCache(): void {
  pricingCache.clear();
  console.log('Pricing cache cleared');
}

export function getPricingCache(key: string): Map<string, number> | undefined {
  return pricingCache.get(key);
}

export function setPricingCache(key: string, data: Map<string, number>): void {
  pricingCache.set(key, data);
}
