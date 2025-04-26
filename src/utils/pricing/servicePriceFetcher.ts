
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbIds, expandClientToDbPackageIds } from './serviceIdMapper';
import { mapServicePricing, mapPackagePricing } from './pricingMapper';

// Test service utility
function hasTestService(serviceIds: string[]) {
  return serviceIds.includes('test-service');
}

// Fetch pricing data for service IDs (isolated from cache)
export async function fetchServicePricingFromDb(serviceIds: string[]): Promise<Array<{ service_id: string; price: number }>> {
  const dbIds = expandClientToDbIds(serviceIds);

  let data: Array<{ service_id: string; price: number }> = [];

  if (hasTestService(serviceIds)) {
    // Query test service by flexible matching
    const { data: testData, error: testErr } = await supabase
      .from('service_pricing')
      .select('service_id, price')
      .eq('is_active', true)
      .or(`service_id.ilike.%test%,service_id.ilike.%trial%`);

    if (!testErr && testData) data = testData;
  }

  // Regular services except test
  const normalIds = dbIds.filter(
    id => !id.toLowerCase().includes('test') && !id.toLowerCase().includes('trial')
  );
  if (normalIds.length > 0) {
    const { data: regData, error } = await supabase
      .from('service_pricing')
      .select('service_id, price')
      .eq('is_active', true)
      .in('service_id', normalIds);
    if (!error && regData) {
      data = [...data, ...regData];
    }
  }
  return data;
}

// Fetch pricing data for package IDs (isolated from cache)
export async function fetchPackagePricingFromDb(packageIds: string[]): Promise<Array<{ service_id: string; price: number }>> {
  const dbIds = expandClientToDbPackageIds(packageIds);

  let query = supabase
    .from('service_pricing')
    .select('service_id, price')
    .eq('type', 'package')
    .eq('is_active', true);

  if (dbIds.length > 0) {
    query = query.in('service_id', dbIds);
  }
  const { data, error } = await query;
  if (error || !data) {
    return [];
  }
  return data;
}

export { hasTestService };
