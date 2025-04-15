
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get admin credentials from environment variables
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')
    
    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not set in environment variables")
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Server configuration error' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get request data
    const requestData = await req.json()
    const { email, password } = requestData

    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Check if credentials match
    if (email === adminEmail && password === adminPassword) {
      // Authentication successful
      console.log("Admin authentication successful")
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Authentication successful'
      }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      // Authentication failed
      console.log("Admin authentication failed - invalid credentials")
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid email or password'
      }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    // Handle errors
    console.error("Error in admin-auth function:", error.message)
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Server error: ' + error.message
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
