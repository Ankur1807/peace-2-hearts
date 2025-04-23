
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
  
  // First pass: add prices for exact matches in the database data
  dbPricing.forEach((item) => {
    const clientId = matchDbToClientId(item.service_id);
    if (clientId) {
      console.log(`Mapped DB ID ${item.service_id} to client ID ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    } else {
      console.log(`No client ID mapping found for DB ID ${item.service_id}`);
    }
  });
  
  // Check if we need to specifically look for the test-service
  const needsTestService = requestedIds?.includes('test-service') && !pricingMap.has('test-service');
  
  if (needsTestService) {
    console.log('Test service requested but not found in DB results, checking for it specifically');
    // Look for test service in the database results with a case-insensitive search
    const testServiceItem = dbPricing.find(item => 
      item.service_id.toLowerCase().includes('test') || 
      item.service_id.toLowerCase().includes('trial')
    );
    
    if (testServiceItem) {
      console.log(`Found test service with price ${testServiceItem.price}`);
      pricingMap.set('test-service', testServiceItem.price);
    } else {
      console.log('No test service found in database, using default price');
      // If we still can't find it, use a default price as fallback
      pricingMap.set('test-service', 11);
    }
  }
  
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
