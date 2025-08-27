import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const obsWebhookUrl = Deno.env.get('OBS_WEBHOOK_SLACK_URL') || '';

// Environment sanity check (no CORS - server-only)
console.log(JSON.stringify({
  fn: "cron-reconcile-missing",
  event: "startup", 
  mode: razorpayKeyId?.includes('_test_') ? 'test' : 'live',
  has_service_key: !!supabaseServiceKey,
  has_rzp_creds: !!(razorpayKeyId && razorpayKeySecret),
  has_slack_webhook: !!obsWebhookUrl,
  ts: new Date().toISOString()
}));

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method?: string;
  email?: string;
  contact?: string;
  created_at: number;
}

/**
 * Structured logging helper
 */
function logEvent(event: string, data: any = {}) {
  console.log(JSON.stringify({
    fn: "cron-reconcile-missing",
    event,
    ...data,
    ts: new Date().toISOString()
  }));
}

/**
 * Fetch payments for a Razorpay order
 */
async function fetchRazorpayOrderPayments(orderId: string): Promise<{
  success: boolean;
  payments?: RazorpayPayment[];
  error?: string;
}> {
  try {
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return { success: true, payments: data.items || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Upsert payment record using canonical rzp_order_id column
 */
async function upsertPaymentRecord(payment: RazorpayPayment): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('payments')
      .upsert({
        rzp_payment_id: payment.id,
        rzp_order_id: payment.order_id, // Canonical column
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        email: payment.email || null,
        notes: { source: 'cron-reconcile-missing', reconciled_at: new Date().toISOString() }
      }, {
        onConflict: 'rzp_payment_id'
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Confirm consultation
 */
async function confirmConsultation(orderId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .neq('status', 'confirmed'); // Only update if not already confirmed
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Reconcile a single payment
 */
async function reconcilePayment(orderId: string): Promise<{
  reconciled: boolean;
  status: string;
  payment_id?: string;
}> {
  try {
    const fetchResult = await fetchRazorpayOrderPayments(orderId);
    
    if (!fetchResult.success || !fetchResult.payments || fetchResult.payments.length === 0) {
      return { reconciled: false, status: "not_found" };
    }
    
    const capturedPayments = fetchResult.payments.filter(p => p.status === 'captured');
    
    if (capturedPayments.length === 0) {
      return { reconciled: false, status: "pending" };
    }
    
    // Use latest captured payment
    const latestCaptured = capturedPayments.sort((a, b) => b.created_at - a.created_at)[0];
    
    // Upsert payment record
    const upsertResult = await upsertPaymentRecord(latestCaptured);
    
    if (!upsertResult.success) {
      return { reconciled: false, status: "error" };
    }
    
    // Confirm consultation
    await confirmConsultation(orderId);
    
    return {
      reconciled: true,
      status: "captured",
      payment_id: latestCaptured.id
    };
    
  } catch (error) {
    logEvent("reconcile_exception", { order_id: orderId, error: error.message });
    return { reconciled: false, status: "error" };
  }
}

/**
 * Send Slack notification (optional)
 */
async function sendSlackNotification(summary: any) {
  if (!obsWebhookUrl) return;
  
  try {
    const message = {
      text: `Payment Reconciliation Summary`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Payment Reconciliation Report*\n• Candidates: ${summary.candidates}\n• Reconciled: ${summary.reconciled}\n• Errors: ${summary.errors}\n• Runtime: ${summary.runtime}ms`
          }
        }
      ]
    };
    
    await fetch(obsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    logEvent("slack_notification_sent", summary);
  } catch (error) {
    logEvent("slack_notification_error", { error: error.message });
  }
}

/**
 * Main reconciliation process
 */
async function runReconciliation(): Promise<{
  candidates: number;
  reconciled: number;
  errors: number;
  runtime: number;
}> {
  const startTime = Date.now();
  
  logEvent("reconciliation_start", {});
  
  try {
    // Find candidate consultations created in last 90 minutes where payment_status != 'paid'
    const { data: candidates, error: queryError } = await supabase
      .from('consultations')
      .select('order_id')
      .gte('created_at', new Date(Date.now() - 90 * 60 * 1000).toISOString()) // 90 minutes ago
      .neq('payment_status', 'paid')
      .not('order_id', 'is', null)
      .limit(50);
    
    if (queryError) {
      logEvent("query_error", { error: queryError.message });
      return { candidates: 0, reconciled: 0, errors: 1, runtime: Date.now() - startTime };
    }
    
    const candidateOrderIds = candidates?.map(c => c.order_id).filter(Boolean) || [];
    
    logEvent("candidates_found", { count: candidateOrderIds.length });
    
    let reconciledCount = 0;
    let errorCount = 0;
    
    // Process each candidate
    for (const orderId of candidateOrderIds) {
      try {
        const result = await reconcilePayment(orderId);
        
        if (result.reconciled) {
          reconciledCount++;
          logEvent("reconciled", { order_id: orderId, payment_id: result.payment_id });
        } else {
          logEvent("not_reconciled", { order_id: orderId, status: result.status });
        }
      } catch (error) {
        errorCount++;
        logEvent("reconcile_error", { order_id: orderId, error: error.message });
      }
    }
    
    const runtime = Date.now() - startTime;
    const summary = {
      candidates: candidateOrderIds.length,
      reconciled: reconciledCount,
      errors: errorCount,
      runtime
    };
    
    logEvent("reconciliation_complete", summary);
    
    // Send Slack notification if configured
    await sendSlackNotification(summary);
    
    return summary;
    
  } catch (error) {
    const runtime = Date.now() - startTime;
    logEvent("reconciliation_exception", { error: error.message, runtime });
    return { candidates: 0, reconciled: 0, errors: 1, runtime };
  }
}

// Main handler (server-only, no CORS)
const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, reason: "method_not_allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  logEvent("cron_invoked", {});
  
  try {
    const summary = await runReconciliation();
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        summary 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    logEvent("cron_error", { error: error.message });
    
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);