
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { apiKey, email, password } = await req.json();
    console.log('Auth request received', { hasApiKey: !!apiKey, hasEmail: !!email, hasPassword: !!password });
    
    // For API key-based authentication
    if (apiKey) {
      const storedApiKey = Deno.env.get("ADMIN_API_KEY");
      console.log('Validating API key');
      
      if (!storedApiKey) {
        console.error('No ADMIN_API_KEY set in environment');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'API key not configured on server'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
      
      if (apiKey === storedApiKey) {
        console.log('API key authentication successful');
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log('API key authentication failed');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid API key'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        );
      }
    }
    
    // For email/password-based authentication
    if (email && password) {
      const adminEmail = Deno.env.get("ADMIN_EMAIL");
      const adminPassword = Deno.env.get("ADMIN_PASSWORD");
      console.log('Validating email/password');
      
      if (!adminEmail || !adminPassword) {
        console.error('Admin credentials not configured on server');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Admin credentials not configured on server'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
      
      if (email === adminEmail && password === adminPassword) {
        console.log('Email/password authentication successful');
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log('Email/password authentication failed');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid credentials'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        );
      }
    }

    console.log('Missing authentication parameters');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing authentication parameters'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  } catch (error) {
    console.error('Error in admin-auth function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
