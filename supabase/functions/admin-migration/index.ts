
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define response headers with CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Verify the admin API key
async function verifyAdminKey(key: string): Promise<boolean> {
  if (!key) return false;
  
  // The admin API key should match the one in the environment variable
  return key === Deno.env.get("ADMIN_API_KEY");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, adminKey } = await req.json();

    // Verify admin authorization
    const isAuthorized = await verifyAdminKey(adminKey);
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Handle different migration actions
    if (action === "drop_payments_table") {
      // Execute the SQL to drop the payments table
      const { error } = await supabaseAdmin.rpc("exec_sql", {
        sql_query: "DROP TABLE IF EXISTS public.payments;"
      });

      if (error) {
        console.error("Error dropping payments table:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Payments table dropped successfully" }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Unknown action
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
