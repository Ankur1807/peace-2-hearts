
/**
 * Maps client-side service IDs to database service IDs
 * @param clientIds - Array of client-side service IDs
 * @returns Array of corresponding database service IDs
 */
export function expandClientToDbIds(clientIds: string[]): string[] {
  if (!clientIds || clientIds.length === 0) {
    return [];
  }
  
  // Map of client IDs to database IDs
  const clientToDbMap: Record<string, string> = {
    // Mental Health Services (P2H-MH)
    'mental-health-counselling': 'P2H-MH-mental-health-counselling',
    'family-therapy': 'P2H-MH-family-therapy',
    'premarital-counselling-individual': 'P2H-MH-premarital-counselling-individual',
    'premarital-counselling-couple': 'P2H-MH-premarital-counselling-couple',
    'couples-counselling': 'P2H-MH-couples-counselling',
    'sexual-health-counselling-individual': 'P2H-MH-sexual-health-counselling',
    'sexual-health-counselling-couple': 'P2H-MH-sexual-health-counselling',
    'test-service': 'P2H-MH-test-service',
    
    // Legal Services (P2H-L)
    'pre-marriage-legal': 'P2H-L-pre-marriage-legal-consultation',
    'mediation': 'P2H-L-mediation-services',
    'divorce': 'P2H-L-divorce-consultation',
    'custody': 'P2H-L-child-custody-consultation',
    'maintenance': 'P2H-L-maintenance-consultation',
    'general-legal': 'P2H-L-general-legal-consultation'
  };
  
  // Map the client IDs to database IDs, filtering out any that don't have a mapping
  return clientIds
    .map(id => clientToDbMap[id])
    .filter(Boolean);
}

/**
 * Maps client-side package IDs to database package IDs
 * @param packageIds - Array of client-side package IDs
 * @returns Array of corresponding database package IDs
 */
export function expandClientToDbPackageIds(packageIds: string[]): string[] {
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  // Map of client package IDs to database package IDs (Holistic Packages P2H-H)
  const packageToDbMap: Record<string, string[]> = {
    'divorce-prevention': ['P2H-H-divorce-prevention-package', 'P2H-H-divorce-prevention-package\r\n'],
    'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions']
  };
  
  // Map the client package IDs to all possible database package IDs
  return packageIds.flatMap(id => packageToDbMap[id] || []);
}
