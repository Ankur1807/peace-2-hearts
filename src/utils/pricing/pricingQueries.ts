
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbIds, expandClientToDbPackageIds } from './serviceIdMapper';

/**
 * Fetch pricing data from service_pricing table
 * @param serviceIds - Array of service IDs to fetch
 * @returns Raw service pricing data
 */
export async function fetchServicePricingData(serviceIds?: string[]) {
  console.log('Fetching service pricing data for:', serviceIds);
  
  // Expand the requested IDs to include database matches
  const expandedIds = serviceIds ? expandClientToDbIds(serviceIds) : [];
  
  console.log('Expanded service IDs to search for:', expandedIds);
  
  let query = supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .eq('type', 'service');
  
  // Apply service_id filter if provided
  if (expandedIds.length > 0) {
    query = query.in('service_id', expandedIds);
  }
  
  // Only fetch active services
  query = query.eq('is_active', true);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching service pricing data:', error);
    throw error;
  }
  
  console.log('Retrieved service pricing data:', data);
  return data || [];
}

/**
 * Fetch all services from service_pricing table (for debugging)
 * @returns All services
 */
export async function fetchAllServiceData() {
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active, type');
    
  if (error) {
    console.error('Error fetching all service data:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Fetch package pricing from service_pricing table
 * @param packageIds - Array of package IDs to fetch
 * @returns Raw package pricing data
 */
export async function fetchPackagePricingFromServiceTable(packageIds?: string[]) {
  console.log('Fetching package pricing from service table for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  const expandedIds = expandClientToDbPackageIds(packageIds);
  console.log('Expanded package IDs to search for:', expandedIds);
  
  // Use a more flexible approach to find package IDs with potential whitespace or newlines
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .eq('type', 'package')
    .or(expandedIds.map(id => `service_id.ilike.%${id.replace(/\r\n/g, '')}%`).join(','))
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching package pricing from service_pricing:', error);
    throw error;
  }
  
  console.log('Retrieved package pricing from service table:', data);
  return data || [];
}

/**
 * Fetch package pricing from service_pricing table filtered by package type
 * @param packageIds - Array of package IDs to fetch
 * @returns Raw package pricing data
 */
export async function fetchPackagePricingFromPackageTable(packageIds?: string[]) {
  console.log('Fetching packages from service_pricing table for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  try {
    // For each package ID, try a more flexible search approach
    const results = [];
    
    for (const packageId of packageIds) {
      const baseId = packageId === 'divorce-prevention' 
        ? 'P2H-H-divorce-prevention-package' 
        : 'P2H-H-pre-marriage-clarity-solutions';
      
      const { data, error } = await supabase
        .from('service_pricing')
        .select('service_id as package_id, price, is_active')
        .eq('type', 'package')
        .ilike('service_id', `%${baseId}%`) // Case-insensitive search
        .eq('is_active', true)
        .maybeSingle();
      
      if (!error && data) {
        results.push(data);
      }
    }
    
    console.log('Retrieved package pricing:', results);
    return results;
  } catch (error) {
    console.log('Failed to fetch packages:', error);
    return [];
  }
}
