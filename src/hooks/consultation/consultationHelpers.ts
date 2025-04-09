
// Helper to determine package name based on service selection
export const getPackageName = (services: string[]): string | null => {
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

  // Check if selected services match a package
  if (services.length === divorcePrevention.length && 
      divorcePrevention.every(s => services.includes(s))) {
    return "Divorce Prevention Package";
  }
  
  if (services.length === preMarriageClarity.length && 
      preMarriageClarity.every(s => services.includes(s))) {
    return "Pre-Marriage Clarity Package";
  }
  
  return null;
};
