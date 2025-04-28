
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
        
        // Basic validation - ensure we have minimum required fields
        if (!consultation.client_email || !consultation.client_name) {
          console.error(`Consultation ${consultation.id} missing required fields (email: ${!!consultation.client_email}, name: ${!!consultation.client_name})`);
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
        
        // Multiple attempts with backoff
        let emailSent = false;
        const maxAttempts = 3;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const emailResult = await sendBookingConfirmationEmail(bookingDetails);
            
            if (emailResult) {
              console.log(`Successfully sent recovery email for consultation ${consultation.id} on attempt ${attempt}`);
              emailSent = true;
              break;
            } else {
              console.error(`Failed to send recovery email for consultation ${consultation.id} on attempt ${attempt}`);
              // Wait before retry (exponential backoff)
              if (attempt < maxAttempts) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Waiting ${delay}ms before retry ${attempt + 1}/${maxAttempts}`);
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
          } catch (retryError) {
            console.error(`Error during email retry ${attempt}/${maxAttempts}:`, retryError);
            if (attempt < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            }
          }
        }
        
        if (emailSent) {
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
          console.error(`Failed to send recovery email for consultation ${consultation.id} after ${maxAttempts} attempts`);
        }
      } catch (emailError) {
        console.error(`Error processing recovery email for consultation ${consultation.id}:`, emailError);
      }
      
      // Add delay between sends to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
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
  // Type is handled by our Window interface extension
  window.recoverEmails = checkAndRecoverEmails;
  
  // Also add a function to recover a single email by reference ID
  window.recoverEmailByReferenceId = async (referenceId: string) => {
    console.log(`Manual recovery requested for reference ID: ${referenceId}`);
    
    try {
      const { data: consultation, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('reference_id', referenceId)
        .single();
        
      if (error || !consultation) {
        console.error(`Could not find consultation with reference ID ${referenceId}:`, error);
        return false;
      }
      
      console.log(`Found consultation:`, {
        id: consultation.id,
        client: consultation.client_name,
        email: consultation.client_email,
        status: consultation.status,
        paymentStatus: consultation.payment_status,
        emailSent: consultation.email_sent
      });
      
      // Check if we have payment details - if not, try to use stored info from session
      if (!consultation.payment_id && window.sessionStorage) {
        const storedPaymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
        if (storedPaymentId) {
          console.log(`Found payment ID ${storedPaymentId} in session storage, updating consultation`);
          
          const { error: updateError } = await supabase
            .from('consultations')
            .update({ 
              payment_id: storedPaymentId,
              payment_status: 'completed'
            })
            .eq('reference_id', referenceId);
            
          if (updateError) {
            console.error(`Error updating payment details:`, updateError);
          }
        }
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
        isResend: true
      };
      
      // Try to send the email
      console.log(`Attempting recovery email for ${bookingDetails.email}`);
      const emailResult = await sendBookingConfirmationEmail(bookingDetails);
      
      if (emailResult) {
        console.log(`✅ Email recovery successful for ${referenceId}`);
        
        // Mark email as sent
        const { error: updateError } = await supabase
          .from('consultations')
          .update({ 
            email_sent: true,
            status: consultation.status === 'payment_received_needs_email' ? 'confirmed' : consultation.status
          })
          .eq('reference_id', referenceId);
        
        if (updateError) {
          console.error(`Could not update consultation record:`, updateError);
          return false;
        }
        
        return true;
      } else {
        console.error(`❌ Email recovery failed for ${referenceId}`);
        return false;
      }
    } catch (error) {
      console.error(`Exception during email recovery:`, error);
      return false;
    }
  };

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
