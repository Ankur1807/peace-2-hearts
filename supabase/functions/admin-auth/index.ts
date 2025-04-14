
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Set up CORS headers for browser requests
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
    // Get request data
    const { email, password } = await req.json()
    
    // Get admin credentials from environment variables
    const adminEmail = Deno.env.get('ADMIN_EMAIL')
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')
    
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
      console.log("Admin authentication failed")
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid credentials'
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
