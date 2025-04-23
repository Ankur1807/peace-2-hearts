
// Define mapping for known IDs
const dbToClientIdMap: Record<string, string> = {
  'Mental-Health-Counselling': 'mental-health-counselling',
  'P2H-MH-mental-health-counselling': 'mental-health-counselling',
  'Family-Therapy': 'family-therapy',
  'P2H-MH-family-therapy': 'family-therapy',
  'Premarital-Counselling': 'premarital-counselling-individual',
  'P2H-MH-premarital-counselling-individual': 'premarital-counselling-individual',
  'Couples-Counselling': 'couples-counselling',
  'P2H-MH-couples-counselling': 'couples-counselling',
  'Pre-Marriage-Legal-Consultation': 'pre-marriage-legal',
  'P2H-L-pre-marriage-legal-consultation': 'pre-marriage-legal',
  'Divorce-Consultation': 'divorce',
  'P2H-L-divorce-consultation': 'divorce',
  'Child-Custody-Consultation': 'custody',
  'P2H-L-child-custody-consultation': 'custody',
  'Mediation-Services': 'mediation',
  'P2H-L-mediation-services': 'mediation',
  'Maintenance-Consultation': 'maintenance',
  'P2H-L-maintenance-consultation': 'maintenance',
  'General-Legal-Consultation': 'general-legal',
  'P2H-L-general-legal-consultation': 'general-legal',
  'P2H-H-divorce-prevention-package': 'divorce-prevention',
  'P2H-H-pre-marriage-clarity-solutions': 'pre-marriage-clarity'
};

export function mapDbIdToClientId(dbId: string): string {
  return dbToClientIdMap[dbId] || dbId;
}

export function expandClientToDbIds(clientIds: string[]): string[] {
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
  const packageToDbMap: Record<string, string[]> = {
    'divorce-prevention': ['P2H-H-divorce-prevention-package'],
    'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions']
  };
  
  const expandedIds: string[] = [];
  packageIds.forEach(id => {
    if (packageToDbMap[id]) {
      expandedIds.push(...packageToDbMap[id]);
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}
