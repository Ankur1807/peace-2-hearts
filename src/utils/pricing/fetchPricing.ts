
// Core pricing fetcher/orchestrator
import { mapServicePricing, mapPackagePricing } from './pricingMapper';
import { getPricingCache, setPricingCache, clearPricingCache as clearCacheUtil } from './pricingCache';
export { formatPrice } from './priceFormatter';

// Helper function to check if a request includes a test service
const hasTestService = (serviceIds: string[] = []) => {
  return serviceIds.includes('test-service');
};

// Fetch service pricing data directly from DB
async function fetchServicePricingFromDb(serviceIds?: string[]) {
  const { supabase } = await import('@/integrations/supabase/client');
  console.log('Fetching service pricing data from DB for:', serviceIds);
  
  let query = supabase
    .from('service_pricing')
    .select('service_id, price, is_active, description')
    .eq('type', 'service')
    .eq('is_active', true);
  
  if (serviceIds && serviceIds.length > 0) {
    query = query.in('service_id', serviceIds);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching service pricing data:', error);
    throw error;
  }
  
  console.log('Retrieved service pricing data:', data);
  return data || [];
}

// Fetch package pricing data directly from DB
async function fetchPackagePricingFromDb(packageIds?: string[]) {
  const { supabase } = await import('@/integrations/supabase/client');
  console.log('Fetching package pricing from DB for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active, description')
    .eq('type', 'package')
    .in('service_id', packageIds)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching package pricing:', error);
    throw error;
  }
  
  console.log('Retrieved package pricing data:', data);
  return data || [];
}

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
