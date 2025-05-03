
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbIds, expandClientToDbPackageIds } from './idMappingService';

export async function fetchServicePricingData(serviceIds?: string[]) {
  console.log('[PRICE DEBUG] Fetching service pricing data for:', serviceIds);
  
  let query = supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .eq('type', 'service');
  
  if (serviceIds && serviceIds.length > 0) {
    // const expandedIds = expandClientToDbIds(serviceIds);
// console.log('[PRICE DEBUG] Expanded service IDs for DB query:', expandedIds);
const expandedIds = ['P2H-MH-mental-health-counselling']; // hardcoded ID known to exist in your Supabase
console.log('[PRICE TEST] Using hardcoded test ID for pricing fetch:', expandedIds);
    query = query.in('service_id', expandedIds);
  }
  
  query = query.eq('is_active', true);
  
  try {
    const { data, error } = await query;
    
    if (error) {
      console.error('[PRICE ERROR] Error fetching service pricing data:', error);
      throw error;
    }
    
    console.log('[PRICE DEBUG] Raw service pricing data response from Supabase:', data);
    return data || [];
  } catch (err) {
    console.error('[PRICE ERROR] Exception in fetchServicePricingData:', err);
    throw err;
  }
}

export async function fetchPackagePricingData(packageIds?: string[]) {
  console.log('[PRICE DEBUG] Fetching package pricing from DB for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    console.log('[PRICE DEBUG] No package IDs provided, returning empty array');
    return [];
  }
  
  const expandedIds = expandClientToDbPackageIds(packageIds);
  console.log('[PRICE DEBUG] Expanded package IDs for DB query:', expandedIds);
  
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .select('service_id, price, is_active, description')
      .eq('type', 'package')
      .in('service_id', expandedIds)
      .eq('is_active', true);
    
    if (error) {
      console.error('[PRICE ERROR] Error fetching package pricing:', error);
      throw error;
    }
    
    console.log('[PRICE DEBUG] Raw package pricing data response from Supabase:', data);
    return data || [];
  } catch (err) {
    console.error('[PRICE ERROR] Exception in fetchPackagePricingData:', err);
    throw err;
  }
}
