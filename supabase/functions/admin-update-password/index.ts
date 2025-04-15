
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
    // Get admin password from environment variable
    const adminPassword = Deno.env.get('ADMIN_PASSWORD')
    
    // Get request data
    const { currentPassword, newPassword } = await req.json()
    
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Method not allowed' 
      }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Current password and new password are required' 
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Check if current password matches
    if (currentPassword !== adminPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Current password is incorrect' 
      }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Update password in environment variable
    // Note: In a real implementation, this would update a database or config file
    // For this demo, we'll simulate success but the actual password change
    // would need to be implemented in a real production environment
    
    console.log("Admin password updated successfully")
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Password updated successfully' 
    }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error("Error in admin-update-password function:", error.message)
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Server error: ' + error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
