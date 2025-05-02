import { getServiceCategoryFromId } from './serviceIdMapper';

/**
 * Gets package name based on selected services
 */
export const getPackageName = (services: string[] = []): string | null => {
  // Sort services to ensure consistent matching regardless of order
  const sortedServices = [...services].sort();
  
  // Check for divorce prevention package (by service IDs, not names)
  const divorcePreventionServices = [
    'couples-counselling', 
    'mental-health-counselling', 
    'mediation', 
    'general-legal'
  ].sort();
  
  // Check for pre-marriage clarity package (by service IDs, not names)
  const preMarriageClarityServices = [
    'pre-marriage-legal', 
    'premarital-counselling-individual', 
    'mental-health-counselling'
  ].sort();
  
  // Direct match on package IDs
  if (services.length === 1) {
    if (services[0] === 'divorce-prevention') {
      return 'Divorce Prevention Package';
    } else if (services[0] === 'pre-marriage-clarity') {
      return 'Pre-Marriage Clarity Package';
    }
  }
  
  // Check if selected services match a predefined package configuration
  if (services.length === divorcePreventionServices.length && 
      JSON.stringify(sortedServices) === JSON.stringify(divorcePreventionServices)) {
    return 'Divorce Prevention Package';
  }
  
  if (services.length === preMarriageClarityServices.length && 
      JSON.stringify(sortedServices) === JSON.stringify(preMarriageClarityServices)) {
    return 'Pre-Marriage Clarity Package';
  }
  
  return null;
};

/**
 * Get the service category for a collection of services
 */
export const getServiceCategory = (services: string[] = []): string => {
  if (services.length === 0) return '';
  
  // If there are multiple service categories, return 'holistic'
  const categories = new Set(services.map(getServiceCategoryFromId));
  
  if (categories.size > 1) return 'holistic';
  
  // Otherwise return the single category
  return Array.from(categories)[0] || '';
};
