
// Map of client-side service IDs to display names
const serviceDisplayNames: Record<string, string> = {
  // Mental Health Services
  'mental-health-counselling': 'Mental Health Counselling',
  'family-therapy': 'Family Therapy',
  'premarital-counselling-individual': 'Premarital Counselling - Individual',
  'premarital-counselling-couple': 'Premarital Counselling - Couple',
  'couples-counselling': 'Couples Counselling',
  'sexual-health-counselling-individual': 'Sexual Health Counselling - Individual',
  'sexual-health-counselling-couple': 'Sexual Health Counselling - Couple',
  
  // Legal Services
  'pre-marriage-legal': 'Pre-marriage Legal Consultation',
  'mediation': 'Mediation Services',
  'divorce': 'Divorce Consultation',
  'custody': 'Child Custody Consultation',
  'maintenance': 'Maintenance Consultation',
  'general-legal': 'General Legal Consultation',
  
  // Package Services
  'divorce-prevention': 'Divorce Prevention Package',
  'pre-marriage-clarity': 'Pre-Marriage Clarity Package',
};

/**
 * Gets a package name if the selected services match a pre-defined package
 */
export function getPackageName(selectedServices: string[]): string | null {
  if (!selectedServices || selectedServices.length === 0) return null;
  
  const sortedServices = [...selectedServices].sort();
  
  // Divorce Prevention Package services
  const divorcePrevention = [
    'couples-counselling',
    'general-legal',
    'mediation',
    'mental-health-counselling'
  ].sort();
  
  // Pre-Marriage Clarity Package services
  const preMarriageClarity = [
    'mental-health-counselling',
    'pre-marriage-legal',
    'premarital-counselling-individual'
  ].sort();
  
  if (sortedServices.length === divorcePrevention.length && 
      JSON.stringify(sortedServices) === JSON.stringify(divorcePrevention)) {
    return "Divorce Prevention Package";
  }
  
  if (sortedServices.length === preMarriageClarity.length && 
      JSON.stringify(sortedServices) === JSON.stringify(preMarriageClarity)) {
    return "Pre-Marriage Clarity Package";
  }
  
  return null;
}

/**
 * Gets a client-friendly display name for a service ID
 */
export function getServiceDisplayName(serviceId: string): string {
  return serviceDisplayNames[serviceId] || serviceId;
}

/**
 * Gets the package service ID from a package name
 */
export function getPackageServiceId(packageName: string | null): string | null {
  if (!packageName) return null;
  
  if (packageName === "Divorce Prevention Package") {
    return "divorce-prevention";
  }
  
  if (packageName === "Pre-Marriage Clarity Package") {
    return "pre-marriage-clarity";
  }
  
  return null;
}
