
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
    
    if (!data || data.length === 0) {
      console.warn('No pricing data found for the requested services');
      
      // If no pricing data is found, use fallback default prices
      if (serviceIds && serviceIds.length > 0) {
        serviceIds.forEach(id => {
          // Set default prices based on service type
          if (id.includes('counselling') || id.includes('therapy')) {
            pricingMap.set(id, 1500); // Default price for counselling services
          } else if (id.includes('legal') || id.includes('divorce') || id.includes('custody')) {
            pricingMap.set(id, 2000); // Default price for legal services
          } else {
            pricingMap.set(id, 1000); // Generic default price
          }
        });
        console.log('Using fallback pricing:', pricingMap);
      }
    } else {
      // Use the pricing data from the database
      data.forEach((item) => {
        pricingMap.set(item.service_id, item.price);
      });
      console.log('Using database pricing:', pricingMap);
    }
    
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchServicePricing:', error);
    // Return empty map on error
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
    
    if (!data || data.length === 0) {
      console.warn('No package pricing data found');
      
      // If no pricing data is found, use fallback default prices
      if (packageIds && packageIds.length > 0) {
        packageIds.forEach(id => {
          if (id === 'divorce-prevention') {
            pricingMap.set(id, 5500);  // Default price for divorce prevention package
          } else if (id === 'pre-marriage-clarity') {
            pricingMap.set(id, 4500);  // Default price for pre-marriage clarity package
          } else {
            pricingMap.set(id, 3500);  // Generic default package price
          }
        });
        console.log('Using fallback package pricing:', pricingMap);
      }
    } else {
      // Use the pricing data from the database
      data.forEach((item) => {
        pricingMap.set(item.package_id, item.price);
      });
      console.log('Using database package pricing:', pricingMap);
    }
    
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchPackagePricing:', error);
    return new Map<string, number>();
  }
}

export function formatPrice(price: number | undefined, currency: string = 'INR'): string {
  if (price === undefined || price <= 0) return 'Price not available';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(price);
}
