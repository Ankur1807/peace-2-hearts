
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
    .select('service_id, price, is_active');
  
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
    .select('service_id, price, is_active');
    
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
  
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .in('service_id', expandedIds)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching package pricing from service_pricing:', error);
    throw error;
  }
  
  console.log('Retrieved package pricing from service table:', data);
  return data || [];
}

/**
 * Fetch package pricing from package_pricing table
 * @param packageIds - Array of package IDs to fetch
 * @returns Raw package pricing data or empty array if table doesn't exist
 */
export async function fetchPackagePricingFromPackageTable(packageIds?: string[]) {
  console.log('Attempting to fetch from package_pricing table for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  const expandedIds = expandClientToDbPackageIds(packageIds);
  
  try {
    const { data, error } = await supabase
      .from('package_pricing')
      .select('package_id, price, is_active')
      .in('package_id', expandedIds)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching from package_pricing table:', error);
      return [];
    }
    
    console.log('Retrieved package pricing from package table:', data);
    return data || [];
  } catch (error) {
    // The package_pricing table might not exist
    console.log('Failed to fetch from package_pricing table (it might not exist):', error);
    return [];
  }
}
