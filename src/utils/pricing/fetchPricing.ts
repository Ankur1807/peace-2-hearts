
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

export async function fetchServicePricing(serviceIds?: string[]): Promise<Map<string, number>> {
  try {
    console.log('Fetching service pricing for:', serviceIds);
    
    // Map of client service IDs to database service IDs
    const clientToDbServiceIdMap: Record<string, string[]> = {
      'mental-health-counselling': ['Mental-Health-Counselling'],
      'family-therapy': ['Family-Therapy'],
      'premarital-counselling': ['Premarital-Counselling'],
      'couples-counselling': ['Couples-Counselling'],
      'sexual-health-counselling': ['Sexual-Health-Counselling'],
      'pre-marriage-legal': ['Pre-Marriage-Legal-Consultation'],
      'divorce-legal': ['Divorce-Consultation'],
      'custody-legal': ['Child-Custody-Consultation'],
      'custody': ['Child-Custody-Consultation'],
      'divorce': ['Divorce-Consultation'],
      'mediation': ['Mediation-Services'],
      'maintenance': ['Maintenance-Consultation'],
      'general-legal': ['General-Legal-Consultation']
    };
    
    // Expand the requested IDs to include database matches
    let expandedIds: string[] = [];
    if (serviceIds && serviceIds.length > 0) {
      serviceIds.forEach(id => {
        if (clientToDbServiceIdMap[id]) {
          expandedIds = [...expandedIds, ...clientToDbServiceIdMap[id]];
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
    
    // Map from database service IDs back to client service IDs
    // Create reverse mapping for db to client IDs
    const dbToClientServiceIdMap: Record<string, string> = {};
    Object.entries(clientToDbServiceIdMap).forEach(([clientId, dbIds]) => {
      dbIds.forEach(dbId => {
        dbToClientServiceIdMap[dbId] = clientId;
      });
    });
    
    data.forEach((item) => {
      if (item.price && item.price > 0) {
        // Find which client ID this DB ID maps to
        const clientId = dbToClientServiceIdMap[item.service_id] || item.service_id;
        
        // If we have a client ID mapping, use it
        if (clientId) {
          pricingMap.set(clientId, item.price);
          console.log(`Set price for ${clientId} (from DB ID ${item.service_id}): ${item.price}`);
        }
        
        // Also set the original service_id for direct matches
        if (!serviceIds || serviceIds.includes(item.service_id)) {
          pricingMap.set(item.service_id, item.price);
          console.log(`Set price for original service ID ${item.service_id}: ${item.price}`);
        }
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
    
    // Map of client package IDs to database package IDs
    const clientToDbPackageIdMap: Record<string, string[]> = {
      'divorce-prevention': ['Divorce-Prevention-Package'],
      'pre-marriage-clarity': ['Pre-Marriage-Package']
    };
    
    // Expand the requested IDs to include database matches
    let expandedIds: string[] = [];
    if (packageIds && packageIds.length > 0) {
      packageIds.forEach(id => {
        if (clientToDbPackageIdMap[id]) {
          expandedIds = [...expandedIds, ...clientToDbPackageIdMap[id]];
        } else {
          expandedIds.push(id);
        }
      });
    }
    
    console.log('Expanded package IDs to search for:', expandedIds);
    
    // First try to get package pricing from the service_pricing table
    const { data, error } = await supabase
      .from('service_pricing')
      .select('service_id, price, is_active')
      .in('service_id', expandedIds)
      .eq('is_active', true);
    
    // Create a map of package_id to price
    const pricingMap = new Map<string, number>();
    
    if (error) {
      console.error('Error fetching package pricing from service_pricing:', error);
    } else if (data && data.length > 0) {
      console.log('Found package pricing in service_pricing table:', data);
      
      // Create reverse mapping for db to client IDs
      const dbToClientPackageIdMap: Record<string, string> = {};
      Object.entries(clientToDbPackageIdMap).forEach(([clientId, dbIds]) => {
        dbIds.forEach(dbId => {
          dbToClientPackageIdMap[dbId] = clientId;
        });
      });
      
      // Use these prices
      data.forEach(pkg => {
        // Find which client ID this DB ID maps to
        const clientId = dbToClientPackageIdMap[pkg.service_id] || pkg.service_id;
        
        if (clientId) {
          pricingMap.set(clientId, pkg.price);
          console.log(`Set package price from service table for ${clientId} (from ${pkg.service_id}): ${pkg.price}`);
        }
        
        // Also set the original service_id for direct matches
        if (!packageIds || packageIds.includes(pkg.service_id)) {
          pricingMap.set(pkg.service_id, pkg.price);
          console.log(`Set price for original package ID ${pkg.service_id}: ${pkg.price}`);
        }
      });
      
      return pricingMap;
    }
    
    // If no pricing found, try fallback to dedicated package_pricing table (if it exists)
    try {
      const { data: packageData, error: packageError } = await supabase
        .from('package_pricing')
        .select('package_id, price, is_active')
        .in('package_id', expandedIds)
        .eq('is_active', true);
      
      if (packageError) {
        console.error('Error fetching from package_pricing table:', packageError);
      } else if (packageData && packageData.length > 0) {
        console.log('Found package pricing in package_pricing table:', packageData);
        
        // Create reverse mapping for db to client IDs
        const dbToClientPackageIdMap: Record<string, string> = {};
        Object.entries(clientToDbPackageIdMap).forEach(([clientId, dbIds]) => {
          dbIds.forEach(dbId => {
            dbToClientPackageIdMap[dbId] = clientId;
          });
        });
        
        // Use these prices
        packageData.forEach(pkg => {
          // Find which client ID this DB ID maps to
          const clientId = dbToClientPackageIdMap[pkg.package_id] || pkg.package_id;
          
          if (clientId) {
            pricingMap.set(clientId, pkg.price);
            console.log(`Set package price from package table for ${clientId} (from ${pkg.package_id}): ${pkg.price}`);
          }
          
          // Also set the original package_id for direct matches
          if (!packageIds || packageIds.includes(pkg.package_id)) {
            pricingMap.set(pkg.package_id, pkg.price);
            console.log(`Set price for original package ID ${pkg.package_id}: ${pkg.price}`);
          }
        });
      }
    } catch (packageTableError) {
      // Ignore errors from package_pricing table as it might not exist
      console.log('Failed to fetch from package_pricing table (it might not exist):', packageTableError);
    }
    
    // If we still don't have pricing information for the requested packages, 
    // calculate based on component services as a last resort
    if (pricingMap.size === 0 && packageIds && packageIds.length > 0) {
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
