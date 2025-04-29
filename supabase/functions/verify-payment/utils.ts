
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

/**
 * Helper function to safely parse JSON
 */
export function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
}

/**
 * Helper function to handle fetch responses
 */
export async function handleFetchResponse(response: Response, apiName: string): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  
  if (!response.ok) {
    const statusCode = response.status;
    let errorText = `API Error (${statusCode})`;
    
    try {
      // Try to extract error details based on content type
      if (contentType.includes('application/json')) {
        const errorJson = await response.json();
        errorText = `API Error (${statusCode}): ${JSON.stringify(errorJson)}`;
      } else {
        errorText = `API Error (${statusCode}): ${await response.text()}`;
      }
    } catch (parseError) {
      errorText = `API Error (${statusCode}): Could not parse error response`;
    }
    
    console.error(`${apiName} request failed:`, errorText);
    throw new Error(errorText);
  }
  
  // Return appropriate format based on content type
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
}
