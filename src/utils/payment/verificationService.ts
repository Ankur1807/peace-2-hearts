
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
    
    // Use the new payment-status endpoint instead of deprecated verify-payment
    const { data, error } = await supabase.functions.invoke('payment-status', {
      body: {
        order_id: orderId
      }
    });
    
    if (error) {
      console.error("Error checking payment status:", error);
      return { 
        success: false, 
        verified: false, 
        error: error.message 
      };
    }
    
    console.log("Payment status result:", data);
    
    // Check if payment is captured
    const isVerified = data.success && data.status === 'captured';
    
    return {
      success: data.success || false,
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
