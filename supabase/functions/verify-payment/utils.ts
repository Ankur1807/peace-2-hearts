
// Set up CORS headers for browser requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Determine the service category based on the service ID
 */
export function determineServiceCategory(serviceId: string): string {
  if (!serviceId) return 'other';
  
  const serviceIdLower = serviceId.toLowerCase();
  
  if (serviceIdLower.includes('legal') || serviceIdLower.includes('lawyer') || serviceIdLower.includes('attorney')) {
    return 'legal';
  }
  
  if (serviceIdLower.includes('mental') || 
      serviceIdLower.includes('therapy') || 
      serviceIdLower.includes('counseling') ||
      serviceIdLower.includes('counselling') ||
      serviceIdLower.includes('psycho')) {
    return 'mental-health';
  }
  
  if (serviceIdLower.includes('holistic') || 
      serviceIdLower.includes('spiritual') || 
      serviceIdLower.includes('healing')) {
    return 'holistic';
  }
  
  if (serviceIdLower.includes('test')) {
    return 'test';
  }
  
  return 'other';
}

/**
 * Format a price in INR
 */
export function formatPrice(price: number): string {
  return `₹${price}`;
}
