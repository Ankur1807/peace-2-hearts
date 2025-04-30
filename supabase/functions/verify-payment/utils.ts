
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

/**
 * Create an immediate success response with redirect URL
 * This allows the frontend to redirect immediately while background tasks complete
 */
export function createSuccessResponse(paymentId: string, orderId: string) {
  return new Response(JSON.stringify({
    success: true,
    verified: true,
    paymentId,
    orderId,
    redirectUrl: "/thank-you"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

/**
 * Create an error response
 */
export function createErrorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({
    success: false,
    message
  }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
