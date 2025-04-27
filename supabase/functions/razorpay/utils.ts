
// Cors headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parse request data safely with improved error handling
export async function parseRequestData(req: Request): Promise<{ data: any, error: string | null }> {
  try {
    // Check if content type is application/json
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content type: ${contentType}`);
      return { data: null, error: 'Invalid content type. Expected application/json' };
    }
    
    // Parse the JSON body
    const body = await req.json();
    return { data: body, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error parsing request data:", errorMessage);
    return { data: null, error: 'Failed to parse request data: ' + errorMessage };
  }
}

// Handle CORS preflight requests
export function handleCors(req: Request): Response | null {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }
  return null;
}

// Get Razorpay API keys from environment
export function getRazorpayKeys(): { key_id: string, key_secret: string } {
  const key_id = Deno.env.get('RAZORPAY_KEY_ID') || '';
  const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
  
  // Log if keys are missing (but don't expose actual keys in logs)
  if (!key_id) {
    console.error("Razorpay key_id is missing or not configured properly");
  } else {
    console.log("Razorpay key_id found");
  }
  
  if (!key_secret) {
    console.error("Razorpay key_secret is missing or not configured properly");
  } else {
    console.log("Razorpay key_secret found");
  }
  
  return {
    key_id,
    key_secret
  };
}

// Store transaction information
export async function storeTransactionData(transactionId: string, orderId: string, amount: number): Promise<void> {
  // In a production environment, you would store this to a database
  console.log("Transaction data stored:", {
    transactionId, 
    orderId, 
    amount,
    timestamp: new Date().toISOString()
  });
}
