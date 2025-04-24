
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

// Create a crypto hash for signature verification
export async function createSignature(orderId: string, paymentId: string, secret: string): Promise<string> {
  const message = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const secretData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    "raw", secretData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Parse and validate request data
export async function parseRequestData(req: Request): Promise<{ data: any; error: string | null }> {
  try {
    const data = await req.json();
    console.log("Request data received:", JSON.stringify(data));
    return { data, error: null };
  } catch (err) {
    console.error("Error parsing request JSON:", err);
    return { 
      data: null, 
      error: 'Invalid JSON in request body' 
    };
  }
}

// Get Razorpay API keys
export function getRazorpayKeys(): { key_id: string | null; key_secret: string | null } {
  const key_id = Deno.env.get('RAZORPAY_KEY_ID');
  const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
  
  if (!key_id || !key_secret) {
    console.error("Razorpay API keys not configured");
  }
  
  return { key_id, key_secret };
}
