
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./bookingEmails";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";
import type { BookingDetails } from "@/utils/types";

/**
 * Check for consultations without confirmation emails and attempt recovery
 */
export async function checkAndRecoverEmails(): Promise<void> {
  try {
    console.log("Checking for consultations without confirmation emails...");
    
    // Find paid consultations where email_sent is false
    const { data: consultationsWithoutEmails, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_status', 'completed')
      .eq('email_sent', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (fetchError) {
      console.error("Error fetching consultations without emails:", fetchError);
      return;
    }
    
    if (!consultationsWithoutEmails || consultationsWithoutEmails.length === 0) {
      console.log("No pending emails to recover");
      return;
    }
    
    console.log(`Found ${consultationsWithoutEmails.length} consultations with completed payment status that need email recovery`);
    
    // Process each consultation and send confirmation email
    for (const consultation of consultationsWithoutEmails) {
      try {
        console.log(`Processing consultation ${consultation.id} (${consultation.reference_id})`);
        
        if (!consultation.reference_id) {
          console.log(`Consultation ${consultation.id} has no reference ID, skipping`);
          continue;
        }
        
        // Create booking details from consultation
        const serviceCategory = determineServiceCategory(consultation.consultation_type);
        
        const bookingDetails: BookingDetails = {
          clientName: consultation.client_name,
          email: consultation.client_email,
          referenceId: consultation.reference_id,
          consultationType: consultation.consultation_type,
          services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
          date: consultation.date ? new Date(consultation.date) : undefined,
          timeSlot: consultation.time_slot,
          timeframe: consultation.timeframe,
          message: consultation.message,
          serviceCategory,
          highPriority: true,
          isRecovery: true
        };
        
        // Try to send the email
        console.log(`Attempting recovery email for ${consultation.client_email} (${consultation.reference_id})`);
        const emailResult = await sendBookingConfirmationEmail(bookingDetails);
        
        if (emailResult) {
          console.log(`Successfully sent recovery email for consultation ${consultation.id}`);
          
          // Mark email as sent
          const { error: updateError } = await supabase
            .from('consultations')
            .update({ 
              email_sent: true,
              status: consultation.status === 'payment_received_needs_email' ? 'confirmed' : consultation.status
            })
            .eq('id', consultation.id);
            
          if (updateError) {
            console.error(`Error updating consultation ${consultation.id} after email recovery:`, updateError);
          }
        } else {
          console.error(`Failed to send recovery email for consultation ${consultation.id}`);
        }
      } catch (emailError) {
        console.error(`Error processing recovery email for consultation ${consultation.id}:`, emailError);
      }
      
      // Add delay between sends to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
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
          path === '/' ||
          path.includes('dashboard')) {
        checkAndRecoverEmails();
      }
    }, 5000);
  });
}
