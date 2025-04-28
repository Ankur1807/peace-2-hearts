
/**
 * Utility functions for migrating from the old payments table to storing
 * payment data directly in the consultations table
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify all consultations have been properly migrated from the payments table
 */
export async function verifyPaymentMigration(): Promise<{
  success: boolean;
  paymentsCount: number;
  consultationsWithoutPayment: number;
}> {
  try {
    // Check if any payments remain in the payments table
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, consultation_id, transaction_id, amount')
      .limit(100);

    if (paymentsError) {
      console.error("Error checking payments table:", paymentsError);
      return { success: false, paymentsCount: 0, consultationsWithoutPayment: 0 };
    }

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
        paymentsCount: payments?.length || 0, 
        consultationsWithoutPayment: 0 
      };
    }

    return {
      success: true,
      paymentsCount: payments?.length || 0,
      consultationsWithoutPayment: consultationsWithoutPayment?.length || 0
    };
  } catch (error) {
    console.error("Error verifying payment migration:", error);
    return { success: false, paymentsCount: 0, consultationsWithoutPayment: 0 };
  }
}

/**
 * Execute the final migration to clean up the payments table
 * Note: This should only be performed by administrators after verification
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
        message: `Found ${verification.consultationsWithoutPayment} paid consultations without payment data. Migration cannot proceed.`
      };
    }

    // If there are still payments, we should not proceed with dropping the table
    if (verification.paymentsCount > 0) {
      // Instead, offer an admin function to migrate remaining data
      return {
        success: false,
        message: `Found ${verification.paymentsCount} records still in the payments table. Please migrate these manually before dropping the table.`
      };
    }

    // Execute DROP TABLE through the admin API
    // This should be implemented in an edge function with proper authentication
    const { data, error } = await supabase.functions.invoke('admin-migration', {
      body: {
        action: 'drop_payments_table',
        adminKey: localStorage.getItem('admin_api_key')
      }
    });

    if (error) {
      console.error("Error dropping payments table:", error);
      return {
        success: false,
        message: `Failed to drop payments table: ${error.message}`
      };
    }

    return {
      success: true,
      message: "Payments table successfully removed. Migration complete."
    };
  } catch (error) {
    console.error("Error executing payment migration:", error);
    return {
      success: false,
      message: `Error executing migration: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
