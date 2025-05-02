
export const getPackageName = (selectedServices: string[] | undefined) => {
  if (!selectedServices || selectedServices.length === 0) return null;
  
  const divorcePrevention = [
    'couples-counselling',
    'mental-health-counselling',
    'mediation',
    'general-legal'
  ];
  
  const preMarriageClarity = [
    'pre-marriage-legal',
    'premarital-counselling',
    'mental-health-counselling'
  ];

  const services = selectedServices || [];
  
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
