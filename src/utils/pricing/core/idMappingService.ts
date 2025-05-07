
// Define mapping for known IDs - with full Supabase IDs as keys
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
  'P2H-L-pre-marriage-legal-consultation': 'pre-marriage-legal',
  'P2H-L-general-legal-consultation': 'general-legal'
};

export function mapDbIdToClientId(dbId: string): string {
  return dbToClientIdMap[dbId] || dbId;
}

export function expandClientToDbIds(clientIds: string[]): string[] {
  // Create reverse mapping (client ID to DB IDs)
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
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}

export function expandClientToDbPackageIds(packageIds: string[]): string[] {
  // This is the critical mapping for packages - use full Supabase IDs
  const packageToDbMap: Record<string, string[]> = {
    'divorce-prevention': ['P2H-H-divorce-prevention-package'],
    'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions']
  };
  
  const expandedIds: string[] = [];
  packageIds.forEach(id => {
    if (packageToDbMap[id]) {
      expandedIds.push(...packageToDbMap[id]);
    } else {
      expandedIds.push(id); // Keep the original ID if no mapping exists
    }
  });
  
  console.log(`Expanded package IDs: ${packageIds} → ${expandedIds}`);
  return expandedIds;
}
