
export const getPackageName = (selectedServices: string[] | undefined) => {
  if (!selectedServices || selectedServices.length === 0) return null;
  
  // If the service is directly one of our package IDs, return its name
  if (selectedServices.includes('divorce-prevention')) {
    return "Divorce Prevention Solutions";
  }
  
  if (selectedServices.includes('pre-marriage-clarity')) {
    return "Pre-Marriage Clarity Solutions";
  }
  
  // Check if it's a collection of services that make up a package
  const divorcePrevention = [
    'couples-counselling',
    'mental-health-counselling',
    'mediation',
    'general-legal'
  ];
  
  // Updated services for pre-marriage clarity
  const preMarriageClarity = [
    'general-legal',
    'couples-counselling',
    'mental-health-counselling'
  ];

  const services = selectedServices || [];
  
  if (services.length === divorcePrevention.length && 
      divorcePrevention.every(s => services.includes(s))) {
    return "Divorce Prevention Solutions";
  }
  
  if (services.length === preMarriageClarity.length && 
      preMarriageClarity.every(s => services.includes(s))) {
    return "Pre-Marriage Clarity Solutions";
  }
  
  return null;
};
