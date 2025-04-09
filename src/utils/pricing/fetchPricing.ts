
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

export async function fetchServicePricing(serviceIds?: string[]): Promise<Map<string, number>> {
  try {
    console.log('Fetching service pricing for:', serviceIds);
    
    // Map of service IDs from client to potential database service IDs
    const serviceIdMap: Record<string, string[]> = {
      'mental-health-counselling': ['mental-health-counselling', 'Mental-Health-Counselling'],
      'premarital-counselling': ['premarital-counselling', 'Premarital Counselling- Individual', 'Premarital Counselling- couple'],
      'sexual-health-counselling': ['sexual-health-counselling', 'Sexual Health Counselling- Individual', 'Sexual Health Counselling- couple'],
      'pre-marriage-legal': ['pre-marriage-legal', 'Pre-marriage-Legal-Consultation'],
      'couples-counselling': ['couples-counselling', 'Couples-Counselling'],
      'family-therapy': ['family-therapy', 'Family-Therapy'],
      'general-legal': ['general-legal'],
      'divorce-legal': ['divorce-legal', 'Divorce-Consultation'],
      'custody-legal': ['custody-legal', 'Child-Custody-Consultation'],
      'mediation': ['mediation', 'Mediation-Services']
    };
    
    // Expand the requested IDs to include possible DB matches
    let expandedIds: string[] = [];
    if (serviceIds && serviceIds.length > 0) {
      serviceIds.forEach(id => {
        if (serviceIdMap[id]) {
          expandedIds = [...expandedIds, ...serviceIdMap[id]];
        } else {
          expandedIds.push(id);
        }
      });
    }
    
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
        .in('service_id', expandedIds || []);
      
      if (allError) {
        console.error('Error fetching all service pricing:', allError);
      } else if (allData && allData.length > 0) {
        console.warn('Found inactive pricing data:', allData);
      }
      
      // Also log all services in the database to help debugging
      const { data: allServices, error: allServicesError } = await supabase
        .from('service_pricing')
        .select('service_id, price, is_active');
        
      if (!allServicesError && allServices) {
        console.log('All available services in database:', allServices.map(s => s.service_id));
      }
      
      return pricingMap; // Return empty map if no active data found
    }
    
    console.log('Retrieved pricing data:', data);
    
    // Map database service IDs back to client service IDs
    data.forEach((item) => {
      if (item.price && item.price > 0) {
        // Find which client ID this DB ID maps to
        let clientId = serviceIds?.find(id => 
          serviceIdMap[id] && serviceIdMap[id].includes(item.service_id)
        ) || item.service_id;
        
        pricingMap.set(clientId, item.price);
        console.log(`Set price for ${clientId} (from DB ID ${item.service_id}): ${item.price}`);
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
    
    // Map of package IDs from client to potential database package IDs
    const packageIdMap: Record<string, string[]> = {
      'divorce-prevention': ['divorce-prevention', 'Divorce-Prevention-Package'],
      'pre-marriage-clarity': ['pre-marriage-clarity', 'Pre-Marriage-Package']
    };
    
    // Expand the requested IDs to include possible DB matches
    let expandedIds: string[] = [];
    if (packageIds && packageIds.length > 0) {
      packageIds.forEach(id => {
        if (packageIdMap[id]) {
          expandedIds = [...expandedIds, ...packageIdMap[id]];
        } else {
          expandedIds.push(id);
        }
      });
    }
    
    console.log('Expanded package IDs to search for:', expandedIds);
    
    // First try to get actual package pricing
    const { data, error } = await supabase
      .from('package_pricing')
      .select('package_id, price, is_active')
      .in('package_id', expandedIds)
      .eq('is_active', true);
    
    // Create a map of package_id to price
    const pricingMap = new Map<string, number>();
    
    if (error) {
      console.error('Error fetching package pricing:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('No package pricing data found for:', packageIds);
      
      // Log all packages in the database to help debugging
      const { data: allPackages, error: allPackagesError } = await supabase
        .from('package_pricing')
        .select('package_id, price, is_active');
        
      if (!allPackagesError && allPackages) {
        console.log('All available packages in database:', allPackages.map(p => p.package_id));
      }
      
      // If no package pricing, check the service_pricing table for package entries
      const { data: servicePackages, error: servicePackagesError } = await supabase
        .from('service_pricing')
        .select('service_id, price, is_active')
        .in('service_id', expandedIds)
        .eq('is_active', true);
        
      if (!servicePackagesError && servicePackages && servicePackages.length > 0) {
        console.log('Found package pricing in service_pricing table:', servicePackages);
        
        // Use these prices
        servicePackages.forEach(pkg => {
          // Find which client ID this DB ID maps to
          let clientId = packageIds?.find(id => 
            packageIdMap[id] && packageIdMap[id].includes(pkg.service_id)
          ) || pkg.service_id;
          
          pricingMap.set(clientId, pkg.price);
          console.log(`Set package price from service table for ${clientId} (from ${pkg.service_id}): ${pkg.price}`);
        });
        
        return pricingMap;
      }
      
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
          // Find which client ID this DB ID maps to
          let clientId = packageIds?.find(id => 
            packageIdMap[id] && packageIdMap[id].includes(item.package_id)
          ) || item.package_id;
          
          pricingMap.set(clientId, item.price);
          console.log(`Set package price from DB for ${clientId} (from ${item.package_id}): ${item.price}`);
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
