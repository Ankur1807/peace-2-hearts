
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
    
    // Check if test service is requested
    const hasTestService = serviceIds.includes('test-service');
    
    // Skip cache for test service to always get fresh data
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
    
    // For test service, use a more flexible query
    let data = [];
    
    if (hasTestService) {
      console.log('Specifically querying for test service');
      const { data: testData, error: testError } = await supabase
        .from('service_pricing')
        .select('service_id, price')
        .eq('is_active', true)
        .or(`service_id.ilike.%test%,service_id.ilike.%trial%`);
        
      if (testError) {
        console.error('Error fetching test service pricing:', testError);
      } else if (testData && testData.length > 0) {
        console.log('Found test service data:', testData);
        data = testData;
      } else {
        console.log('No test service found in database, fetching all services to check');
        
        // Try to get all services to find anything with "test" in the name
        const { data: allData, error: allError } = await supabase
          .from('service_pricing')
          .select('service_id, price')
          .eq('is_active', true);
          
        if (allError) {
          console.error('Error fetching all services:', allError);
        } else {
          // Filter for anything that might be a test service
          const possibleTestServices = allData?.filter(item => 
            item.service_id.toLowerCase().includes('test') || 
            item.service_id.toLowerCase().includes('trial')
          );
          
          if (possibleTestServices && possibleTestServices.length > 0) {
            console.log('Found possible test services:', possibleTestServices);
            data = possibleTestServices;
          } else {
            console.log('No test services found in any database records');
          }
        }
      }
    }
    
    // For regular services, use standard query with in() operator
    if (serviceIds.filter(id => id !== 'test-service').length > 0) {
      const regularIds = dbIds.filter(id => 
        !id.toLowerCase().includes('test') && 
        !id.toLowerCase().includes('trial')
      );
      
      if (regularIds.length > 0) {
        console.log('Fetching regular service pricing for:', regularIds);
        const { data: regularData, error } = await supabase
          .from('service_pricing')
          .select('service_id, price')
          .eq('is_active', true)
          .in('service_id', regularIds);
          
        if (error) {
          console.error('Error fetching regular service pricing:', error);
        } else if (regularData && regularData.length > 0) {
          // Combine with any test service data
          data = [...data, ...regularData];
        }
      }
    }
    
    console.log('Raw pricing data from database:', data);
    
    // Create the pricing map from database data
    const pricingMap = mapServicePricing(data, serviceIds);
    
    // Cache the result
    pricingCache[cacheKey] = {
      data: pricingMap,
      timestamp: Date.now()
    };
    
    console.log('Final pricing map:', Object.fromEntries(pricingMap));
    return pricingMap;
  } catch (error) {
    console.error('Failed to fetch service pricing:', error);
    return new Map<string, number>();
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
