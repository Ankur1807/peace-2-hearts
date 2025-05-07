
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./bookingEmails";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";
import { BookingDetails } from "@/utils/types";

/**
 * Manual recovery function for resending confirmation emails by reference ID
 * This can be called from the browser console for immediate troubleshooting
 */
export async function recoverEmailByReferenceId(referenceId: string): Promise<boolean> {
  console.log(`Starting manual email recovery for reference ID: ${referenceId}`);
  
  try {
    // Step 1: Fetch the consultation details
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !consultation) {
      console.error(`Could not find consultation with reference ID: ${referenceId}`, error);
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
    
    // Step 2: Create booking details from consultation data
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
    
    // Step 3: Send the email with high priority
    console.log(`Attempting to send recovery email to ${bookingDetails.email}`);
    const emailResult = await sendBookingConfirmationEmail(bookingDetails);
    
    if (emailResult) {
      console.log(`✅ Email recovery successful for ${referenceId}`);
      
      // Step 4: Update the consultation record to mark email as sent
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
}

/**
 * Scheduled recovery function to automatically check and recover any failed emails
 * This runs on page load to catch any emails that weren't sent during payment processing
 * 
 * NOTE: This function is now centralized and called from App.tsx 
 * to avoid duplicate runs across the application
 */
export async function automatedEmailRecovery(): Promise<void> {
  // This implementation is kept for backward compatibility
  // The actual implementation is in emailRecovery.ts
  console.log('Using automated email recovery from manualEmailRecovery.ts - consider updating your imports');
  
  // Import and call the central implementation
  const { automatedEmailRecovery: centralizedRecovery } = await import('./emailRecovery');
  return centralizedRecovery();
}

// Add to window object for easy access from console
if (typeof window !== 'undefined') {
  // @ts-ignore - Add to window object
  window.recoverEmailByReferenceId = recoverEmailByReferenceId;
  window.automatedEmailRecovery = automatedEmailRecovery;
  
  // REMOVED duplicate initialization here to prevent multiple runs
}
