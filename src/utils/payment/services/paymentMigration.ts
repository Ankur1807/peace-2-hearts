
/**
 * Utility functions for payment system migrations
 * Note: The payments table has been migrated to storing payment data directly in consultations
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify all consultations have been properly migrated
 * @returns Verification status
 */
export async function verifyPaymentMigration(): Promise<{
  success: boolean;
  paymentsCount: number;
  consultationsWithoutPayment: number;
}> {
  try {
    // The payments table no longer exists - migration completed
    const paymentsCount = 0;

    // Get consultations that should have payment info but don't
    const { data: consultationsWithoutPayment, error: consultationsError } = await supabase
      .from('consultations')
      .select('id, reference_id')
      .is('payment_id', null)
      .eq('status', 'paid')
      .limit(100);

    if (consultationsError) {
      console.error("Error checking consultations:", consultationsError);
      return { 
        success: false, 
        paymentsCount: 0, 
        consultationsWithoutPayment: 0 
      };
    }

    return {
      success: true,
      paymentsCount: 0, // Always 0 since table no longer exists
      consultationsWithoutPayment: consultationsWithoutPayment?.length || 0
    };
  } catch (error) {
    console.error("Error verifying payment migration:", error);
    return { success: false, paymentsCount: 0, consultationsWithoutPayment: 0 };
  }
}

/**
 * Execute the final migration cleanup steps
 * Note: This function is maintained for historical purposes only
 * The payments table has already been migrated
 */
export async function executePaymentMigration(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Verify migration is safe to perform
    const verification = await verifyPaymentMigration();
    
    if (!verification.success) {
      return {
        success: false,
        message: "Migration verification failed. Please check the console for details."
      };
    }
    
    if (verification.consultationsWithoutPayment > 0) {
      return {
        success: false,
        message: `Found ${verification.consultationsWithoutPayment} paid consultations without payment data. Please fix these records first.`
      };
    }

    return {
      success: true,
      message: "Payment system migration has been completed. The payments table no longer exists."
    };
  } catch (error) {
    console.error("Error executing payment migration:", error);
    return {
      success: false,
      message: `Error with migration status check: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
