
/**
 * Maps database service pricing data to a client-side pricing map
 * @param data - Raw service pricing data from database
 * @param requestedIds - Optional array of requested service IDs for validation
 * @returns Map of service_id to price
 */
export function mapServicePricing(
  data: Array<{ service_id: string; price: number }>,
  requestedIds?: string[]
): Map<string, number> {
  // Create a map of service_id to price
  const pricingMap = new Map<string, number>();
  
  // Define mapping from DB IDs to client IDs
  const dbToClientMap: Record<string, string> = {
    'P2H-MH-mental-health-counselling': 'mental-health-counselling',
    'P2H-MH-family-therapy': 'family-therapy',
    'P2H-MH-premarital-counselling-individual': 'premarital-counselling-individual',
    'P2H-MH-premarital-counselling-couple': 'premarital-counselling-couple',
    'P2H-MH-couples-counselling': 'couples-counselling',
    'P2H-MH-sexual-health-counselling': 'sexual-health-counselling-individual',
    'P2H-L-pre-marriage-legal-consultation': 'pre-marriage-legal',
    'P2H-L-mediation-services': 'mediation',
    'P2H-L-divorce-consultation': 'divorce',
    'P2H-L-child-custody-consultation': 'custody',
    'P2H-L-maintenance-consultation': 'maintenance',
    'P2H-L-general-legal-consultation': 'general-legal',
    'P2H-MH-test-service': 'test-service'
  };
  
  if (!data || data.length === 0) {
    console.log('No pricing data to map');
    return pricingMap;
  }
  
  // Add each service to the map
  for (const item of data) {
    // Map DB ID to client ID
    const clientId = dbToClientMap[item.service_id.trim()];
    
    if (clientId) {
      console.log(`Mapped DB ID ${item.service_id} to client ID ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    } else {
      // If we don't have a mapping, use the original ID as fallback
      console.log(`No mapping for DB ID ${item.service_id}, using as-is with price ${item.price}`);
      const simplifiedId = item.service_id.replace('P2H-MH-', '').replace('P2H-L-', '').replace('-consultation', '');
      pricingMap.set(simplifiedId, item.price);
    }
  }
  
  // If specific IDs were requested, check if any are missing
  if (requestedIds && requestedIds.length > 0) {
    requestedIds.forEach(id => {
      if (!pricingMap.has(id)) {
        console.warn(`No price found for requested service: ${id}`);
      }
    });
  }
  
  console.log('Final pricing map:', Object.fromEntries(pricingMap));
  return pricingMap;
}

/**
 * Maps database package pricing data to a client-side pricing map
 * @param data - Raw package pricing data from database
 * @param requestedIds - Optional array of requested package IDs for validation
 * @returns Map of package_id to price
 */
export function mapPackagePricing(
  data: Array<{ package_id?: string; service_id?: string; price: number }>,
  requestedIds?: string[]
): Map<string, number> {
  // Create a map of package_id to price
  const pricingMap = new Map<string, number>();
  
  // Define mapping from DB IDs to client IDs
  const dbToClientMap: Record<string, string> = {
    'P2H-H-divorce-prevention-package': 'divorce-prevention',
    'P2H-H-pre-marriage-clarity-solutions': 'pre-marriage-clarity'
  };
  
  if (!data || data.length === 0) {
    console.log('No package pricing data to map');
    return pricingMap;
  }
  
  // Add each package to the map
  for (const item of data) {
    const dbId = item.package_id || item.service_id;
    
    if (!dbId) {
      console.warn('Package item is missing both package_id and service_id:', item);
      continue;
    }
    
    // Map DB ID to client ID
    const clientId = dbToClientMap[dbId.trim()];
    
    if (clientId) {
      console.log(`Mapped DB ID ${dbId} to client ID ${clientId} with price ${item.price}`);
      pricingMap.set(clientId, item.price);
    } else {
      // If we don't have a mapping, use the original ID as fallback
      console.log(`No mapping for DB ID ${dbId}, using as-is with price ${item.price}`);
      const simplifiedId = dbId.replace('P2H-H-', '').replace('-package', '').replace('-solutions', '');
      pricingMap.set(simplifiedId, item.price);
    }
  }
  
  // If specific IDs were requested, check if any are missing
  if (requestedIds && requestedIds.length > 0) {
    requestedIds.forEach(id => {
      if (!pricingMap.has(id)) {
        console.warn(`No price found for requested package: ${id}`);
      }
    });
  }
  
  console.log('Final package pricing map:', Object.fromEntries(pricingMap));
  return pricingMap;
}
