
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbIds, expandClientToDbPackageIds } from './idMappingService';

export async function fetchServicePricingData(serviceIds?: string[]) {
  console.log('Fetching service pricing data for:', serviceIds);
  
  const expandedIds = serviceIds ? expandClientToDbIds(serviceIds) : [];
  
  let query = supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .eq('type', 'service');
  
  if (expandedIds.length > 0) {
    query = query.in('service_id', expandedIds);
  }
  
  query = query.eq('is_active', true);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching service pricing data:', error);
    throw error;
  }
  
  console.log('Retrieved service pricing data:', data);
  return data || [];
}

export async function fetchPackagePricingData(packageIds?: string[]) {
  console.log('Fetching package pricing from DB for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  const expandedIds = expandClientToDbPackageIds(packageIds);
  console.log('Expanded package IDs for DB query:', expandedIds);
  
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active, description')
    .eq('type', 'package')
    .in('service_id', expandedIds)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching package pricing:', error);
    throw error;
  }
  
  console.log('Retrieved package pricing data:', data);
  return data || [];
}
