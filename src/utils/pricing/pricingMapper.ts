
import { matchDbToClientId } from './serviceIdMapper';

/**
 * Maps database service pricing data to client-side pricing map
 * @param dbPricing Database pricing data
 * @param requestedIds Optional array of client-side service IDs 
 * @returns Map of client service IDs to prices
 */
export function mapServicePricing(
  dbPricing: Array<{ service_id: string; price: number }>,
  requestedIds?: string[]
): Map<string, number> {
  console.log('Mapping pricing data for services:', dbPricing);
  const pricingMap = new Map<string, number>();
  
  // Process database price data
  dbPricing.forEach((item) => {
    const clientId = matchDbToClientId(item.service_id);
    if (clientId) {
      console.log(`Mapped DB ID ${item.service_id} to client ID ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
      
      // Special case for test service: also set it as "test-service" if that ID was requested
      if (clientId.includes('test') && requestedIds?.includes('test-service') && !pricingMap.has('test-service')) {
        console.log(`Also setting price ${item.price} for explicitly requested test-service ID`);
        pricingMap.set('test-service', item.price);
      }
    } else {
      console.log(`No client ID mapping found for DB ID ${item.service_id}`);
      
      // If we can't map it but it looks like a test service and test-service was requested
      if ((item.service_id.toLowerCase().includes('test') || item.service_id.toLowerCase().includes('trial')) 
          && requestedIds?.includes('test-service') && !pricingMap.has('test-service')) {
        console.log(`Setting price ${item.price} for test-service based on partial match with ${item.service_id}`);
        pricingMap.set('test-service', item.price);
      }
    }
  });

  // Log the final mapping
  console.log('Final service pricing map:', Object.fromEntries(pricingMap));
  
  return pricingMap;
}

/**
 * Maps database package pricing data to client-side pricing map
 * @param dbPricing Database pricing data
 * @param requestedIds Optional array of client-side package IDs
 * @returns Map of client package IDs to prices
 */
export function mapPackagePricing(
  dbPricing: Array<{ service_id: string; price: number } | { package_id: string; price: number }>,
  requestedIds?: string[]
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  // Process the pricing data
  dbPricing.forEach((item) => {
    // Handle both formats of the data (service_id or package_id)
    const dbId = (item as any).service_id || (item as any).package_id;
    const clientId = matchDbToClientId(dbId);
    
    if (clientId) {
      console.log(`Mapped DB package ID ${dbId} to client ID ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    } else {
      console.log(`No client ID mapping found for DB package ID ${dbId}`);
    }
  });
  
  return pricingMap;
}
