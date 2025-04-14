
export function getPackageName(selectedServices: string[]): string | null {
  // Divorce Prevention Package services
  const divorcePrevention = [
    'couples-counselling',
    'mental-health-counselling',
    'mediation',
    'general-legal'
  ];
  
  // Pre-Marriage Clarity Package services
  const preMarriageClarity = [
    'pre-marriage-legal',
    'premarital-counselling',
    'mental-health-counselling'
  ];

  // Sort services to ensure consistent comparison
  const sortedServices = [...selectedServices].sort();
  
  // Check if selected services match a package
  if (divorcePrevention.length === sortedServices.length &&
      divorcePrevention.every(service => sortedServices.includes(service))) {
    return "Divorce Prevention Package";
  }
  
  if (preMarriageClarity.length === sortedServices.length &&
      preMarriageClarity.every(service => sortedServices.includes(service))) {
    return "Pre-Marriage Clarity Package";
  }
  
  return null;
}
