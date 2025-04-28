
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./emailService";
import { fetchConsultationData, createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";

/**
 * Check for payments without confirmation emails and attempt recovery
 */
export async function checkAndRecoverEmails(): Promise<void> {
  try {
    console.log("Checking for payments without confirmation emails...");
    
    // Find payments where email_sent is false
    const { data: paymentsWithoutEmails, error: fetchError } = await supabase
      .from('payments')
      .select(`
        id,
        transaction_id,
        amount,
        payment_status,
        consultations:consultation_id (
          id,
          reference_id,
          client_name,
          client_email,
          consultation_type,
          date,
          time_slot,
          timeframe,
          message,
          status
        )
      `)
      .eq('email_sent', false)
      .limit(10);
    
    if (fetchError) {
      console.error("Error fetching payments without emails:", fetchError);
      return;
    }
    
    if (!paymentsWithoutEmails || paymentsWithoutEmails.length === 0) {
      console.log("No pending emails to recover");
      return;
    }
    
    console.log(`Found ${paymentsWithoutEmails.length} payments without confirmation emails`);
    
    // Process each payment and send confirmation email
    for (const payment of paymentsWithoutEmails) {
      if (!payment.consultations) {
        console.log(`Payment ${payment.id} has no associated consultation, skipping`);
        continue;
      }
      
      const consultation = payment.consultations;
      
      if (!consultation.reference_id) {
        console.log(`Consultation for payment ${payment.id} has no reference ID, skipping`);
        continue;
      }
      
      try {
        console.log(`Attempting to recover email for payment ${payment.id}, reference ID ${consultation.reference_id}`);
        
        // Create booking details from consultation
        const bookingDetails = createBookingDetailsFromConsultation(consultation);
        
        if (!bookingDetails) {
          console.log(`Could not create booking details for consultation ${consultation.id}, skipping`);
          continue;
        }
        
        // Try to send the email
        const emailResult = await sendBookingConfirmationEmail({
          ...bookingDetails,
          isRecovery: true,
          highPriority: true
        });
        
        if (emailResult) {
          console.log(`Successfully sent recovery email for payment ${payment.id}`);
          
          // Update payment record to mark email as sent
          await supabase
            .from('payments')
            .update({ email_sent: true, recovery_timestamp: new Date().toISOString() })
            .eq('id', payment.id);
        } else {
          console.error(`Failed to send recovery email for payment ${payment.id}`);
        }
      } catch (emailError) {
        console.error(`Error processing recovery email for payment ${payment.id}:`, emailError);
      }
    }
    
    console.log("Email recovery process completed");
  } catch (error) {
    console.error("Error in email recovery process:", error);
  }
}

/**
 * Add this function to window so it can be called from the console for manual recovery
 */
// @ts-ignore - Window extension
window.recoverEmails = checkAndRecoverEmails;

// Run a check on page load if in a supported environment (with supabase client)
if (typeof window !== 'undefined') {
  // Wait for app to be fully loaded before checking
  window.addEventListener('load', () => {
    // Give the app time to initialize
    setTimeout(() => {
      // Only run on certain pages to avoid unnecessary calls
      const path = window.location.pathname;
      if (path.includes('payment-confirmation') || 
          path.includes('payment-verification') || 
          path === '/') {
        checkAndRecoverEmails();
      }
    }, 5000);
  });
}
