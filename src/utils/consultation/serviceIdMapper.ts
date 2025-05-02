
/**
 * Service ID mapping utility to ensure consistent SKU-based service identification
 */

// Map from client-side IDs to database SKUs
export const clientToDbIdMap: Record<string, string> = {
  // Mental Health services
  'mental-health-counselling': 'P2H-MH-COUNSEL',
  'family-therapy': 'P2H-MH-FAMILY',
  'couples-counselling': 'P2H-MH-COUPLES',
  'premarital-counselling-individual': 'P2H-MH-PREMAR-IND',
  'premarital-counselling-couple': 'P2H-MH-PREMAR-CPL',
  'sexual-health-counselling': 'P2H-MH-SEXUAL',
  'test-service': 'P2H-TEST',
  
  // Legal services
  'pre-marriage-legal': 'P2H-L-PREMAR',
  'mediation': 'P2H-L-MEDIATION',
  'divorce': 'P2H-L-DIVORCE',
  'custody': 'P2H-L-CUSTODY',
  'maintenance': 'P2H-L-MAINT',
  'general-legal': 'P2H-L-GENERAL',
  
  // Holistic packages
  'divorce-prevention': 'P2H-H-DIVPREV',
  'pre-marriage-clarity': 'P2H-H-PREMARCLAR'
};

// Map from database SKUs to client-side IDs
export const dbToClientIdMap: Record<string, string> = 
  Object.entries(clientToDbIdMap).reduce((acc, [clientId, dbId]) => {
    acc[dbId] = clientId;
    return acc;
  }, {} as Record<string, string>);

/**
 * Convert client-side service ID to database SKU
 */
export function mapClientToDbId(clientId: string): string {
  return clientToDbIdMap[clientId] || clientId;
}

/**
 * Convert database SKU to client-side service ID
 */
export function mapDbToClientId(dbId: string): string {
  return dbToClientIdMap[dbId] || dbId;
}

/**
 * Convert array of client-side service IDs to database SKUs
 */
export function expandClientToDbIds(clientIds: string[]): string[] {
  return clientIds.map(id => mapClientToDbId(id));
}

/**
 * Convert array of client-side package IDs to database SKUs
 */
export function expandClientToDbPackageIds(packageIds: string[]): string[] {
  return packageIds.map(id => mapClientToDbId(id));
}

/**
 * Get service category from service ID
 */
export function getServiceCategoryFromId(serviceId: string): string {
  const dbId = mapClientToDbId(serviceId);
  
  if (dbId.startsWith('P2H-MH-')) {
    return 'mental-health';
  } else if (dbId.startsWith('P2H-L-')) {
    return 'legal';
  } else if (dbId.startsWith('P2H-H-')) {
    return 'holistic';
  }
  
  // Fallback for test services
  if (serviceId === 'test-service') {
    return 'mental-health';
  }
  
  return 'unknown';
}
