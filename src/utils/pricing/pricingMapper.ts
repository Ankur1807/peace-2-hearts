
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
  
  // Check if we need test service pricing
  const isTestServiceRequested = requestedIds?.includes('test-service');
  
  if (isTestServiceRequested) {
    // Always set a fixed price for test service
    const TEST_SERVICE_PRICE = 11;
    console.log(`Setting fixed test service price: ${TEST_SERVICE_PRICE}`);
    pricingMap.set('test-service', TEST_SERVICE_PRICE);
  }
  
  // Process database price data for other services
  dbPricing.forEach((item) => {
    const clientId = matchDbToClientId(item.service_id);
    if (clientId) {
      console.log(`Mapped DB ID ${item.service_id} to client ID ${clientId} with price ${item.price}`);
      
      // Don't overwrite the test service price if already set
      if (clientId !== 'test-service' || !pricingMap.has('test-service')) {
        pricingMap.set(clientId, item.price);
      }
    } else {
      console.log(`No client ID mapping found for DB ID ${item.service_id}`);
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
