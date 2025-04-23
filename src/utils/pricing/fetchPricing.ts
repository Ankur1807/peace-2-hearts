
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbIds, expandClientToDbPackageIds } from './serviceIdMapper';
import { mapServicePricing, mapPackagePricing } from './pricingMapper';

// Cache for pricing data to reduce API calls
let pricingCache: Record<string, { data: Map<string, number>, timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

/**
 * Format price value to INR currency string
 */
export const formatPrice = (price: number, currency = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return `${price.toLocaleString('en-US')}`;
};

/**
 * Fetch pricing data for specified service IDs
 * @param serviceIds Array of client-side service IDs to fetch pricing for
 * @param skipCache Whether to bypass the cache and force a fresh API call
 * @returns Map of client service IDs to their prices
 */
export async function fetchServicePricing(
  serviceIds: string[] = [], 
  skipCache = false
): Promise<Map<string, number>> {
  try {
    const cacheKey = `services-${serviceIds.sort().join('-')}`;
    
    // Special handling for test service to ensure we always skip cache
    const hasTestService = serviceIds.includes('test-service');
    if (hasTestService) {
      skipCache = true;
      console.log('Test service requested, forcing cache bypass');
    }
    
    // Return cached data if available and not expired
    if (!skipCache && pricingCache[cacheKey]) {
      const cached = pricingCache[cacheKey];
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Using cached pricing data for services:', serviceIds);
        return cached.data;
      }
    }
    
    console.log('Fetching pricing data for services:', serviceIds);
    
    // Convert client IDs to database IDs
    const dbIds = expandClientToDbIds(serviceIds);
    
    if (dbIds.length === 0 && serviceIds.length > 0) {
      console.warn('No DB IDs found for client service IDs:', serviceIds);
    }
    
    // Query the database for pricing data
    let query = supabase
      .from('service_pricing')
      .select('service_id, price')
      .eq('type', 'service')
      .eq('is_active', true);
    
    // Special handling for test-service
    if (hasTestService) {
      console.log('Specifically querying for test service with multiple patterns');
      // Create a more flexible search for test service with multiple OR conditions
      if (serviceIds.length === 1) {
        // If only test service is requested, use pattern matching
        query = query.or(`service_id.ilike.%test%,service_id.ilike.%trial%`);
      } else {
        // If other services are also requested, use a combination approach
        const testServicePatterns = ['%test%', '%trial%'];
        const testQuery = supabase
          .from('service_pricing')
          .select('service_id, price')
          .eq('type', 'service')
          .eq('is_active', true)
          .or(`service_id.ilike.%test%,service_id.ilike.%trial%`);
        
        const { data: testData, error: testError } = await testQuery;
        
        if (testError) {
          console.error('Error fetching test service pricing:', testError);
        } else if (testData && testData.length > 0) {
          console.log('Found test service pricing data:', testData);
          // Continue with regular query for other services
          const nonTestServiceIds = dbIds.filter(id => 
            !id.toLowerCase().includes('test') && 
            !id.toLowerCase().includes('trial')
          );
          
          if (nonTestServiceIds.length > 0) {
            query = query.in('service_id', nonTestServiceIds);
          }
          
          const { data: regularData, error: regularError } = await query;
          
          if (regularError) {
            console.error('Error fetching regular service pricing:', regularError);
          } else {
            // Combine test service data with regular service data
            const combinedData = [...(testData || []), ...(regularData || [])];
            console.log('Combined pricing data:', combinedData);
            
            // Create the pricing map from combined database data
            const pricingMap = mapServicePricing(combinedData, serviceIds);
            
            // Cache the result
            pricingCache[cacheKey] = {
              data: pricingMap,
              timestamp: Date.now()
            };
            
            console.log('Final pricing map:', Object.fromEntries(pricingMap));
            return pricingMap;
          }
        }
      }
    } 
    // If not specifically handling test service or the above didn't work
    else if (dbIds.length > 0) {
      // Filter by the provided service IDs
      query = query.in('service_id', dbIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service pricing:', error);
      throw error;
    }
    
    console.log('Raw pricing data from database:', data);
    
    // Create the pricing map from database data
    const pricingMap = mapServicePricing(data || [], serviceIds);
    
    // If test service was requested but not found in the database, add a default price
    if (hasTestService && !pricingMap.has('test-service')) {
      console.log('Test service price not found in DB, setting default price of 11');
      pricingMap.set('test-service', 11);
    }
    
    // Cache the result
    pricingCache[cacheKey] = {
      data: pricingMap,
      timestamp: Date.now()
    };
    
    console.log('Final pricing map:', Object.fromEntries(pricingMap));
    return pricingMap;
  } catch (error) {
    console.error('Failed to fetch service pricing:', error);
    
    // Create a pricing map with available data
    const pricingMap = new Map<string, number>();
    
    // If test-service was requested, ensure it has a price
    if (serviceIds.includes('test-service')) {
      console.log('Setting default price for test service due to API error');
      pricingMap.set('test-service', 11);
    }
    
    return pricingMap;
  }
}

/**
 * Fetch pricing data for specified package IDs
 * @param packageIds Array of client-side package IDs to fetch pricing for
 * @param skipCache Whether to bypass the cache and force a fresh API call
 * @returns Map of client package IDs to their prices
 */
export async function fetchPackagePricing(
  packageIds: string[] = [],
  skipCache = false
): Promise<Map<string, number>> {
  try {
    const cacheKey = `packages-${packageIds.sort().join('-')}`;
    
    // Return cached data if available and not expired
    if (!skipCache && pricingCache[cacheKey]) {
      const cached = pricingCache[cacheKey];
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Using cached pricing data for packages:', packageIds);
        return cached.data;
      }
    }
    
    console.log('Fetching pricing data for packages:', packageIds);
    
    // Convert client IDs to database IDs
    const dbIds = expandClientToDbPackageIds(packageIds);
    
    if (dbIds.length === 0 && packageIds.length > 0) {
      console.warn('No DB IDs found for client package IDs:', packageIds);
    }
    
    // Query the database for pricing data
    let query = supabase
      .from('service_pricing')
      .select('service_id, price')
      .eq('type', 'package')
      .eq('is_active', true);
    
    // Filter by package IDs if provided
    if (dbIds.length > 0) {
      query = query.in('service_id', dbIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching package pricing:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No pricing data found for packages:', packageIds);
      return new Map<string, number>();
    }
    
    console.log('Received package pricing data from API:', data);
    
    const pricingMap = mapPackagePricing(data, packageIds);
    
    // Cache the result
    pricingCache[cacheKey] = {
      data: pricingMap,
      timestamp: Date.now()
    };
    
    return pricingMap;
  } catch (error) {
    console.error('Failed to fetch package pricing:', error);
    return new Map<string, number>();
  }
}

// Clear the pricing cache
export function clearPricingCache() {
  pricingCache = {};
  console.log('Pricing cache cleared');
}
