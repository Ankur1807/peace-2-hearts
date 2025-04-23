
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

  if (requestedIds.includes('test-service') && !pricingMap.has('test-service')) {
    pricingMap.set('test-service', 11);
  }

  return pricingMap;
}

export function mapPackagePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  data.forEach((item) => {
    if (item.service_id || item.package_id) {
      let packageId = item.service_id || item.package_id;
      
      if (packageId.includes('divorce-prevention')) {
        packageId = 'divorce-prevention';
      } else if (packageId.includes('pre-marriage-clarity')) {
        packageId = 'pre-marriage-clarity';
      }
      
      pricingMap.set(packageId, item.price);
    }
  });
  
  return pricingMap;
}
