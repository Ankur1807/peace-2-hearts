
import { mapDbIdToClientId } from './idMappingService';

export function mapServicePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  console.log("mapServicePricing called with data:", data, "and requestedIds:", requestedIds);
  
  data.forEach((item) => {
    if (item.service_id && item.price) {
      const serviceId = item.service_id.trim();
      const clientId = mapDbIdToClientId(serviceId);
      pricingMap.set(clientId, item.price);
      console.log(`Mapped service ${serviceId} → ${clientId} with price ${item.price}`);
    }
  });

  console.log('mapServicePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}

export function mapPackagePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  console.log("mapPackagePricing called with data:", data, "and requestedIds:", requestedIds);
  
  data.forEach((item) => {
    if ((item.service_id || item.package_id) && item.price) {
      // Normalize package ID
      let packageId = item.service_id || item.package_id;
      const clientId = mapDbIdToClientId(packageId);

      console.log(`Mapping package DB ID: ${packageId} → client ID: ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    }
  });
  
  console.log('mapPackagePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}
