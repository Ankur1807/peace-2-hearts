
/**
 * Legacy payment migration utility (no longer needed)
 * 
 * This file is kept for backward compatibility but its functionality
 * has been integrated into the consultations table directly.
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify all consultations have been properly migrated
 */
export async function verifyPaymentMigration(): Promise<{
  success: boolean;
  migratedConsultations: number;
  consultationsWithoutPayment: number;
}> {
  try {
    // Check consultations that should have payment info but don't
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
        migratedConsultations: 0, 
        consultationsWithoutPayment: 0 
      };
    }

    // Get count of successfully migrated consultations
    const { count, error: countError } = await supabase
      .from('consultations')
      .select('id', { count: 'exact' })
      .not('payment_id', 'is', null)
      .eq('status', 'paid');

    if (countError) {
      console.error("Error counting migrated consultations:", countError);
      return { 
        success: false, 
        migratedConsultations: 0, 
        consultationsWithoutPayment: consultationsWithoutPayment?.length || 0 
      };
    }

    return {
      success: true,
      migratedConsultations: count || 0,
      consultationsWithoutPayment: consultationsWithoutPayment?.length || 0
    };
  } catch (error) {
    console.error("Error verifying payment migration:", error);
    return { 
      success: false, 
      migratedConsultations: 0, 
      consultationsWithoutPayment: 0 
    };
  }
}

/**
 * This function is retained for backward compatibility but does nothing
 * as the payments table has been migrated to store data in consultations table
 */
export async function executePaymentMigration(): Promise<{
  success: boolean;
  message: string;
}> {
  // Migration is already complete, this is just a placeholder
  return {
    success: true,
    message: "Payment data is now stored directly in the consultations table. No migration needed."
  };
}
