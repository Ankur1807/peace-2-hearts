
import { mapDbIdToClientId } from './idMappingService';

export function mapServicePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  console.log("[PRICE DEBUG] mapServicePricing input data:", data, "and requestedIds:", requestedIds);
  
  if (!data || data.length === 0) {
    console.warn("[PRICE WARNING] No service pricing data to map");
    return pricingMap;
  }
  
  data.forEach((item) => {
    if (item.service_id && item.price !== undefined && item.price !== null) {
      const serviceId = item.service_id.trim();
      const clientId = mapDbIdToClientId(serviceId);
      pricingMap.set(clientId, item.price);
      console.log(`[PRICE DEBUG] Mapped service ${serviceId} → ${clientId} with price ${item.price}`);
    } else {
      console.warn("[PRICE WARNING] Skipping invalid pricing item:", item);
    }
  });

  console.log('[PRICE DEBUG] Final mapServicePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}

export function mapPackagePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  console.log("[PRICE DEBUG] mapPackagePricing input data:", data, "and requestedIds:", requestedIds);
  
  if (!data || data.length === 0) {
    console.warn("[PRICE WARNING] No package pricing data to map");
    return pricingMap;
  }
  
  data.forEach((item) => {
    if ((item.service_id || item.package_id) && item.price !== undefined && item.price !== null) {
      // Normalize package ID
      let packageId = item.service_id || item.package_id;
      const clientId = mapDbIdToClientId(packageId);

      console.log(`[PRICE DEBUG] Mapping package DB ID: ${packageId} → client ID: ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    } else {
      console.warn("[PRICE WARNING] Skipping invalid package item:", item);
    }
  });
  
  console.log('[PRICE DEBUG] Final mapPackagePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}
