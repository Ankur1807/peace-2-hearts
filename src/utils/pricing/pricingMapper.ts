
import { 
  getDbToClientServiceIdMap, 
  getDbToClientPackageIdMap 
} from './serviceIdMapper';

/**
 * Map database service price data to client-side price map
 * @param data - Raw service pricing data
 * @param serviceIds - Optional list of requested service IDs
 * @returns Map of service_id to price
 */
export function mapServicePricing(data: any[], serviceIds?: string[]): Map<string, number> {
  const pricingMap = new Map<string, number>();
  const dbToClientServiceIdMap = getDbToClientServiceIdMap();
  
  if (!data || data.length === 0) {
    console.warn('No active pricing data found for the requested services:', serviceIds);
    return pricingMap;
  }
  
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
}

/**
 * Map database package price data to client-side price map
 * @param data - Raw package pricing data
 * @param packageIds - Optional list of requested package IDs
 * @returns Map of package_id to price
 */
export function mapPackagePricing(data: any[], packageIds?: string[]): Map<string, number> {
  const pricingMap = new Map<string, number>();
  const dbToClientPackageIdMap = getDbToClientPackageIdMap();
  
  if (!data || data.length === 0) {
    return pricingMap;
  }
  
  data.forEach((pkg) => {
    const serviceId = pkg.service_id || pkg.package_id;
    
    if (!serviceId) {
      console.warn('Package missing ID:', pkg);
      return;
    }
    
    // Find which client ID this DB ID maps to
    const clientId = dbToClientPackageIdMap[serviceId] || serviceId;
    
    if (clientId) {
      pricingMap.set(clientId, pkg.price);
      console.log(`Set package price for ${clientId} (from ${serviceId}): ${pkg.price}`);
    }
    
    // Also set the original ID for direct matches
    if (!packageIds || packageIds.includes(serviceId)) {
      pricingMap.set(serviceId, pkg.price);
      console.log(`Set price for original package ID ${serviceId}: ${pkg.price}`);
    }
  });
  
  return pricingMap;
}
