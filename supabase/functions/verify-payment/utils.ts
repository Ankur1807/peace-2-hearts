
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
  
  if (serviceId.includes('legal')) return 'legal';
  if (serviceId.includes('mental') || serviceId.includes('therapy') || serviceId.includes('counseling')) return 'mental-health';
  if (serviceId.includes('holistic')) return 'holistic';
  if (serviceId.includes('test')) return 'test';
  
  return 'other';
}
