
/**
 * Maps client-side service IDs to database IDs and vice versa
 * This helps translate between the client-friendly IDs and database IDs
 */

// Map of client-friendly service IDs to database service IDs
const serviceIdMap: Record<string, string[]> = {
  'mental-health-counselling': ['P2H-MH-mental-health-counselling', 'mental-health-counselling'],
  'family-therapy': ['P2H-MH-family-therapy', 'family-therapy'],
  'premarital-counselling-individual': ['P2H-MH-premarital-counselling-individual', 'premarital-individual'],
  'premarital-counselling-couple': ['P2H-MH-premarital-counselling-couple', 'premarital-couple'],
  'couples-counselling': ['P2H-MH-couples-counselling', 'couples-counselling'],
  'sexual-health-counselling': ['P2H-MH-sexual-health-counselling', 'sexual-health-counselling'],
  'test-service': ['P2H-test-service', 'test-service', 'test', 'trial-service', 'trial', 'p2h test', 'p2h-test'], 
  
  // Legal services
  'pre-marriage-legal': ['P2H-L-pre-marriage-legal', 'pre-marriage-legal'],
  'mediation': ['P2H-L-mediation', 'mediation'],
  'divorce': ['P2H-L-divorce', 'divorce'],
  'custody': ['P2H-L-custody', 'custody'],
  'maintenance': ['P2H-L-maintenance', 'maintenance'],
  'general-legal': ['P2H-L-general-legal', 'general-legal']
};

// Map of client-friendly package IDs to database package IDs
const packageIdMap: Record<string, string[]> = {
  'divorce-prevention': ['P2H-H-divorce-prevention-package', 'divorce-prevention-package'],
  'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions', 'pre-marriage-clarity-solutions'] 
};

/**
 * Expand a client-side service ID to include all possible database IDs
 * @param clientId Client-side service ID
 * @returns Array of possible database service IDs
 */
export function expandClientToDbIds(clientIds: string[]): string[] {
  const dbIds: string[] = [];
  
  clientIds.forEach(clientId => {
    if (serviceIdMap[clientId]) {
      dbIds.push(...serviceIdMap[clientId]);
    } else {
      // If there's no mapping, include the original ID as a fallback
      dbIds.push(clientId);
    }
  });
  
  return dbIds;
}

/**
 * Expand a client-side package ID to include all possible database IDs
 * @param clientId Client-side package ID
 * @returns Array of possible database package IDs
 */
export function expandClientToDbPackageIds(clientIds: string[]): string[] {
  const dbIds: string[] = [];
  
  clientIds.forEach(clientId => {
    if (packageIdMap[clientId]) {
      dbIds.push(...packageIdMap[clientId]);
    } else {
      // If there's no mapping, include the original ID as a fallback
      dbIds.push(clientId);
    }
  });
  
  return dbIds;
}

/**
 * Match a database service ID to its client-side ID
 * @param dbId Database service ID
 * @returns Client-side service ID or null if not found
 */
export function matchDbToClientId(dbId: string): string | null {
  // Special case for test service - check for common patterns
  const lowerDbId = dbId.toLowerCase().trim();
  if (lowerDbId.includes('test') || lowerDbId.includes('trial')) {
    console.log(`Matched database ID ${dbId} to test-service`);
    return 'test-service';
  }
  
  // Check all service ID mappings
  for (const [clientId, dbIds] of Object.entries(serviceIdMap)) {
    if (dbIds.some(id => dbId.includes(id))) {
      return clientId;
    }
  }
  
  // Check package ID mappings
  for (const [clientId, dbIds] of Object.entries(packageIdMap)) {
    if (dbIds.some(id => dbId.includes(id))) {
      return clientId;
    }
  }
  
  return null;
}
