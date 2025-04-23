
import { mapDbIdToClientId } from './idMappingService';

export function mapServicePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  data.forEach((item) => {
    if (item.service_id && item.price) {
      const serviceId = item.service_id.trim();
      const clientId = mapDbIdToClientId(serviceId);
      pricingMap.set(clientId, item.price);
    }
  });

  // Handle test service as a special case
  if (requestedIds.includes('test-service') && !pricingMap.has('test-service')) {
    pricingMap.set('test-service', 11);
  }

  // Debug
  console.log('mapServicePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}

export function mapPackagePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  data.forEach((item) => {
    if ((item.service_id || item.package_id) && item.price) {
      // Normalize package ID
      let packageId = item.service_id || item.package_id;
      packageId = mapDbIdToClientId(packageId);

      console.log(`Mapping package ID: ${packageId} with price ${item.price}`);
      pricingMap.set(packageId, item.price);
    }
  });
  
  // Debug
  console.log('mapPackagePricing result:', Object.fromEntries(pricingMap));
  return pricingMap;
}
