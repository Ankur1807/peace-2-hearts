
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

export async function fetchServicePricing(serviceIds?: string[]): Promise<Map<string, number>> {
  try {
    console.log('Fetching service pricing for:', serviceIds);
    
    let query = supabase
      .from('service_pricing')
      .select('service_id, price, is_active');
    
    // Apply service_id filter if provided
    if (serviceIds && serviceIds.length > 0) {
      query = query.in('service_id', serviceIds);
    }
    
    // Only fetch active services
    query = query.eq('is_active', true);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching service pricing:', error);
      throw error;
    }
    
    // Create a map of service_id to price
    const pricingMap = new Map<string, number>();
    
    if (!data || data.length === 0) {
      console.warn('No active pricing data found for the requested services:', serviceIds);
      
      // Try fetching without the is_active filter to see if any data exists
      const { data: allData, error: allError } = await supabase
        .from('service_pricing')
        .select('service_id, price, is_active')
        .in('service_id', serviceIds || []);
      
      if (allError) {
        console.error('Error fetching all service pricing:', allError);
      } else if (allData && allData.length > 0) {
        console.warn('Found inactive pricing data:', allData);
      }
      
      return pricingMap; // Return empty map if no active data found
    }
    
    console.log('Retrieved pricing data:', data);
    
    // Use the pricing data from the database
    data.forEach((item) => {
      if (item.price && item.price > 0) {
        pricingMap.set(item.service_id, item.price);
        console.log(`Set price for ${item.service_id}: ${item.price}`);
      } else {
        console.warn(`Service ${item.service_id} has invalid price: ${item.price}`);
      }
    });
    
    console.log('Final pricing map:', Object.fromEntries(pricingMap));
    return pricingMap;
  } catch (error) {
    console.error('Error in fetchServicePricing:', error);
    // Return empty map on error
    return new Map<string, number>();
  }
}

export async function fetchPackagePricing(packageIds?: string[]): Promise<Map<string, number>> {
  try {
    console.log('Fetching package pricing for:', packageIds);
    
    if (!packageIds || packageIds.length === 0) {
      return new Map<string, number>();
    }
    
    // First try to get actual package pricing
    const { data, error } = await supabase
      .from('package_pricing')
      .select('package_id, price, is_active')
      .in('package_id', packageIds)
      .eq('is_active', true);
    
    // Create a map of package_id to price
    const pricingMap = new Map<string, number>();
    
    if (error) {
      console.error('Error fetching package pricing:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('No package pricing data found for:', packageIds);
      
      // If no package pricing, calculate based on component services
      if (packageIds && packageIds.length > 0) {
        for (const packageId of packageIds) {
          let serviceIds: string[] = [];
          
          if (packageId === 'divorce-prevention') {
            serviceIds = ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal'];
            console.log('Calculating divorce prevention package from services:', serviceIds);
          } else if (packageId === 'pre-marriage-clarity') {
            serviceIds = ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'];
            console.log('Calculating pre-marriage clarity package from services:', serviceIds);
          }
          
          if (serviceIds.length > 0) {
            const servicesPricing = await fetchServicePricing(serviceIds);
            let packageTotal = 0;
            let allServicesHavePrices = true;
            
            // Sum up the prices of component services
            serviceIds.forEach(serviceId => {
              const servicePrice = servicesPricing.get(serviceId);
              if (servicePrice && servicePrice > 0) {
                packageTotal += servicePrice;
                console.log(`Adding ${servicePrice} for ${serviceId}`);
              } else {
                allServicesHavePrices = false;
                console.log(`Missing price for ${serviceId}`);
              }
            });
            
            // Only apply the package discount if all services have prices
            if (packageTotal > 0 && allServicesHavePrices) {
              packageTotal = Math.round(packageTotal * 0.85); // 15% discount
              pricingMap.set(packageId, packageTotal);
              console.log(`Set package price for ${packageId}: ${packageTotal} (after 15% discount)`);
            } else if (packageTotal > 0) {
              // If we have some prices but not all, still set the price without discount
              pricingMap.set(packageId, packageTotal);
              console.log(`Set partial package price for ${packageId}: ${packageTotal} (no discount applied)`);
            }
          }
        }
      }
    } else {
      // Use the pricing data from the database
      data.forEach((item) => {
        if (item.price && item.price > 0) {
          pricingMap.set(item.package_id, item.price);
          console.log(`Set package price from DB for ${item.package_id}: ${item.price}`);
        } else {
          console.warn(`Package ${item.package_id} has invalid price: ${item.price}`);
        }
      });
    }
    
    console.log('Final package pricing map:', Object.fromEntries(pricingMap));
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
