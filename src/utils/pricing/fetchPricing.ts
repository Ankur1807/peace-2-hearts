
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

export async function fetchServicePricing(serviceIds?: string[]): Promise<Map<string, number>> {
  try {
    let query = supabase
      .from('service_pricing')
      .select('service_id, price')
      .eq('is_active', true);
    
    if (serviceIds && serviceIds.length > 0) {
      query = query.in('service_id', serviceIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service pricing:', error);
      throw error;
    }
    
    // Create a map of service_id to price
    const pricingMap = new Map<string, number>();
    data?.forEach((item) => {
      pricingMap.set(item.service_id, item.price);
    });
    
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchServicePricing:', error);
    return new Map<string, number>();
  }
}

export async function fetchPackagePricing(packageIds?: string[]): Promise<Map<string, number>> {
  try {
    let query = supabase
      .from('package_pricing')
      .select('package_id, price')
      .eq('is_active', true);
    
    if (packageIds && packageIds.length > 0) {
      query = query.in('package_id', packageIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching package pricing:', error);
      throw error;
    }
    
    // Create a map of package_id to price
    const pricingMap = new Map<string, number>();
    data?.forEach((item) => {
      pricingMap.set(item.package_id, item.price);
    });
    
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchPackagePricing:', error);
    return new Map<string, number>();
  }
}

export function formatPrice(price: number | undefined, currency: string = 'INR'): string {
  if (price === undefined) return 'Price not available';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(price);
}
