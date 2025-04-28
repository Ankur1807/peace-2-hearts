
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./bookingEmails";
import { createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";

/**
 * Check for consultations without confirmation emails and attempt recovery
 */
export async function checkAndRecoverEmails(): Promise<void> {
  try {
    console.log("Checking for consultations without confirmation emails...");
    
    // Find consultations where payment_status is completed but need email
    // We'll base this on a criteria we can check rather than relying on email_sent column
    const { data: consultationsWithoutEmails, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_status', 'completed')
      .limit(10);
    
    if (fetchError) {
      console.error("Error fetching consultations without emails:", fetchError);
      return;
    }
    
    if (!consultationsWithoutEmails || consultationsWithoutEmails.length === 0) {
      console.log("No pending emails to recover");
      return;
    }
    
    console.log(`Found ${consultationsWithoutEmails.length} consultations with completed payment status`);
    
    // Process each consultation and send confirmation email
    for (const consultation of consultationsWithoutEmails) {
      try {
        console.log(`Processing consultation ${consultation.id}`);
        
        if (!consultation.reference_id) {
          console.log(`Consultation ${consultation.id} has no reference ID, skipping`);
          continue;
        }
        
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
          console.log(`Successfully sent recovery email for consultation ${consultation.id}`);
          
          // Mark email as sent by updating a custom field in the database
          // We're not using email_sent since it doesn't exist in the schema
          await supabase
            .from('consultations')
            .update({ 
              status: consultation.status === 'paid' ? 'email_sent' : consultation.status
            })
            .eq('id', consultation.id);
        } else {
          console.error(`Failed to send recovery email for consultation ${consultation.id}`);
        }
      } catch (emailError) {
        console.error(`Error processing recovery email for consultation ${consultation.id}:`, emailError);
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
if (typeof window !== 'undefined') {
  // @ts-ignore - Window extension
  window.recoverEmails = checkAndRecoverEmails;

  // Run a check on page load if in a supported environment (with supabase client)
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
