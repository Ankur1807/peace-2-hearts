
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';

interface VerificationResult {
  success: boolean;
  verified: boolean;
  error?: string;
  details?: any;
}

/**
 * Check payment status using the new payment-status endpoint
 */
export async function verifyPaymentAndCreateBooking(
  paymentId: string, 
  orderId: string,
  signature: string | undefined,
  bookingDetails: BookingDetails
): Promise<VerificationResult> {
  try {
    console.log(`Checking payment status for order ${orderId}`);
    
    // Use GET request to payment-status endpoint
    const supabaseUrl = 'https://mcbdxszoozmlelejvizn.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0';
    const url = `${supabaseUrl}/functions/v1/payment-status?order_id=${encodeURIComponent(orderId)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log("Payment status result:", data);
    
    // Check if payment is captured
    const isVerified = data.success && data.status === 'captured';
    
    return {
      success: data.success !== false, // true for captured, pending_webhook, not_found
      verified: isVerified,
      details: data
    };
  } catch (err) {
    console.error("Error in verifyPaymentAndCreateBooking:", err);
    return {
      success: false,
      verified: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}
