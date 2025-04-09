
/**
 * Maps client service IDs to database service IDs and vice versa
 */

// Map of client service IDs to database service IDs
export const clientToDbServiceIdMap: Record<string, string[]> = {
  'mental-health-counselling': ['Mental-Health-Counselling'],
  'family-therapy': ['Family-Therapy'],
  'premarital-counselling-individual': ['Premarital-Counselling-Individual'],
  'premarital-counselling-couple': ['Premarital-Counselling-couple'],
  'couples-counselling': ['Couples-Counselling'],
  'sexual-health-counselling-individual': ['Sexual-Health-Counselling-Individual'],
  'sexual-health-counselling-couple': ['Sexual-Health-Counselling-couple'],
  'pre-marriage-legal': ['Pre-marriage-Legal-Consultation'],
  'divorce': ['Divorce-Consultation'],
  'custody': ['Child-Custody-Consultation'],
  'mediation': ['Mediation-Services'],
  'maintenance': ['Maintenance-Consultation'],
  'general-legal': ['General-Legal-Consultation']
};

// Map of client package IDs to database package IDs
export const clientToDbPackageIdMap: Record<string, string[]> = {
  'divorce-prevention': ['Divorce-Prevention-Package'],
  'pre-marriage-clarity': ['Pre-Marriage-Package']
};

/**
 * Get database service IDs for client service IDs
 * @param clientIds - Client-side service IDs
 * @returns Expanded array of database service IDs
 */
export function expandClientToDbIds(clientIds: string[]): string[] {
  if (!clientIds || clientIds.length === 0) {
    return [];
  }
  
  let expandedIds: string[] = [];
  
  clientIds.forEach(id => {
    if (clientToDbServiceIdMap[id]) {
      expandedIds = [...expandedIds, ...clientToDbServiceIdMap[id]];
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}

/**
 * Get database package IDs for client package IDs
 * @param clientIds - Client-side package IDs
 * @returns Expanded array of database package IDs
 */
export function expandClientToDbPackageIds(clientIds: string[]): string[] {
  if (!clientIds || clientIds.length === 0) {
    return [];
  }
  
  let expandedIds: string[] = [];
  
  clientIds.forEach(id => {
    if (clientToDbPackageIdMap[id]) {
      expandedIds = [...expandedIds, ...clientToDbPackageIdMap[id]];
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}

/**
 * Create a reverse mapping from database IDs to client IDs
 * @param idMap - Map of client IDs to database IDs
 * @returns Map of database IDs to client IDs
 */
export function createReverseMapping(idMap: Record<string, string[]>): Record<string, string> {
  const reverseMap: Record<string, string> = {};
  
  Object.entries(idMap).forEach(([clientId, dbIds]) => {
    dbIds.forEach(dbId => {
      reverseMap[dbId] = clientId;
    });
  });
  
  return reverseMap;
}

/**
 * Get client service ID for database service ID
 * @returns Map of database service IDs to client service IDs
 */
export function getDbToClientServiceIdMap(): Record<string, string> {
  return createReverseMapping(clientToDbServiceIdMap);
}

/**
 * Get client package ID for database package ID
 * @returns Map of database package IDs to client package IDs
 */
export function getDbToClientPackageIdMap(): Record<string, string> {
  return createReverseMapping(clientToDbPackageIdMap);
}
