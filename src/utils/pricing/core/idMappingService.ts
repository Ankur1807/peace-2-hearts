
/**
 * Maps database service IDs to client-side service IDs
 * 
 * Database IDs use P2H prefix (e.g., P2H-MH-mental-health-counselling)
 * Client IDs use simple format (e.g., mental-health-counselling)
 */

// Map from DB ID to client ID
export function mapDbIdToClientId(dbId: string): string {
  // Handle special cases first
  if (dbId === 'P2H-H-divorce-prevention-package') {
    return 'divorce-prevention';
  }
  if (dbId === 'P2H-H-pre-marriage-clarity-solutions') {
    return 'pre-marriage-clarity';
  }

  // General case: remove the prefix
  // P2H-MH-mental-health-counselling -> mental-health-counselling
  // P2H-L-divorce-consultation -> divorce-consultation
  const parts = dbId.split('-');
  if (parts.length >= 2 && (parts[0] === 'P2H')) {
    return parts.slice(2).join('-');
  }
  
  // If no transformation needed or possible, return as is
  return dbId;
}

// Map from client ID to DB ID
export function expandClientToDbIds(clientId: string): string {
  // Handle special cases first
  if (clientId === 'divorce-prevention') {
    return 'P2H-H-divorce-prevention-package';
  }
  if (clientId === 'pre-marriage-clarity') {
    return 'P2H-H-pre-marriage-clarity-solutions';
  }
  
  // Determine category prefix based on service type
  let prefix = 'P2H-';
  if (clientId.includes('counselling') || clientId.includes('therapy') || 
      clientId.includes('mental-health')) {
    prefix += 'MH-';
  } else if (clientId.includes('consultation') || clientId.includes('legal') || 
            clientId.includes('custody') || clientId.includes('mediation')) {
    prefix += 'L-';
  } else if (clientId.includes('package') || clientId.includes('solution') ||
            clientId.includes('holistic')) {
    prefix += 'H-';
  } else {
    // Default to mental health if we can't determine
    prefix += 'MH-';
  }
  
  return prefix + clientId;
}

// Special function for package IDs
export function expandClientToDbPackageIds(clientId: string): string {
  if (clientId === 'divorce-prevention') {
    return 'P2H-H-divorce-prevention-package';
  }
  if (clientId === 'pre-marriage-clarity') {
    return 'P2H-H-pre-marriage-clarity-solutions';
  }
  
  // Default behavior if not a known package
  return 'P2H-H-' + clientId;
}
