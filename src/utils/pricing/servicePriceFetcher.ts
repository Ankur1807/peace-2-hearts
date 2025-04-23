
import { supabase } from '@/integrations/supabase/client';

export const hasTestService = (serviceIds: string[] = []) => {
  return serviceIds.includes('test-service');
};

export async function fetchServicePricingFromDb(serviceIds?: string[]) {
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

export async function fetchPackagePricingFromDb(packageIds?: string[]) {
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

