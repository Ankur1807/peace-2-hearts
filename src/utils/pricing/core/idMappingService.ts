
// Define mapping for known IDs
const dbToClientIdMap: Record<string, string> = {
  'P2H-MH-sexual-health-counselling': 'sexual-health-counselling',
  'P2H-MH-couples-counselling': 'couples-counselling',
  'P2H-L-mediation-services': 'mediation',
  'P2H-L-maintenance-consultation': 'maintenance',
  'P2H-MH-family-therapy': 'family-therapy',
  'P2H-H-divorce-prevention-package': 'divorce-prevention',
  'P2H-MH-test-service': 'test-service',
  'P2H-L-child-custody-consultation': 'custody',
  'P2H-H-pre-marriage-clarity-solutions': 'pre-marriage-clarity',
  'P2H-L-divorce-consultation': 'divorce',
  'P2H-MH-mental-health-counselling': 'mental-health-counselling',
  'P2H-L-general-legal-consultation': 'general-legal'
};

export function mapDbIdToClientId(dbId: string): string {
  console.log(`[PRICE DEBUG] Mapping DB ID to client ID: ${dbId} → ${dbToClientIdMap[dbId] || dbId}`);
  return dbToClientIdMap[dbId] || dbId;
}

export function expandClientToDbIds(clientIds: string[]): string[] {
  console.log(`[PRICE DEBUG] Expanding client IDs to DB IDs: ${clientIds.join(', ')}`);
  
  const clientToDbMap = Object.entries(dbToClientIdMap).reduce((acc, [dbId, clientId]) => {
    if (!acc[clientId]) {
      acc[clientId] = [];
    }
    acc[clientId].push(dbId);
    return acc;
  }, {} as Record<string, string[]>);

  const expandedIds: string[] = [];
  clientIds.forEach(id => {
    if (clientToDbMap[id]) {
      expandedIds.push(...clientToDbMap[id]);
      console.log(`[PRICE DEBUG] Expanded client ID ${id} to DB IDs: ${clientToDbMap[id].join(', ')}`);
    } else {
      expandedIds.push(id);
      console.log(`[PRICE DEBUG] No mapping found for client ID: ${id}, using as-is`);
    }
  });
  
  console.log(`[PRICE DEBUG] Final expanded DB IDs: ${expandedIds.join(', ')}`);
  return expandedIds;
}

export function expandClientToDbPackageIds(packageIds: string[]): string[] {
  console.log(`[PRICE DEBUG] Expanding package client IDs to DB IDs: ${packageIds.join(', ')}`);
  
  // This is the critical mapping for packages
  const packageToDbMap: Record<string, string[]> = {
    'divorce-prevention': ['P2H-H-divorce-prevention-package'],
    'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions']
  };
  
  const expandedIds: string[] = [];
  packageIds.forEach(id => {
    if (packageToDbMap[id]) {
      expandedIds.push(...packageToDbMap[id]);
      console.log(`[PRICE DEBUG] Expanded package client ID ${id} to DB IDs: ${packageToDbMap[id].join(', ')}`);
    } else {
      expandedIds.push(id); // Keep the original ID if no mapping exists
      console.log(`[PRICE DEBUG] No mapping found for package client ID: ${id}, using as-is`);
    }
  });
  
  console.log(`[PRICE DEBUG] Expanded package IDs: ${packageIds} → ${expandedIds}`);
  return expandedIds;
}
