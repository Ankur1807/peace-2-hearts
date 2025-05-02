
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./bookingEmails";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";
import { BookingDetails } from "@/utils/types";

/**
 * Manual recovery function for resending confirmation emails by reference ID
 * This can be called from the browser console for immediate troubleshooting
 * but only on payment-related pages
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
 * This runs on page load to catch any emails that weren't sent during payment processing,
 * but only on payment confirmation pages
 */
export async function automatedEmailRecovery(): Promise<void> {
  // Check if we're on a payment-related page before running
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const isPaymentPage = currentPath.includes('/payment-confirmation') || 
                        currentPath.includes('/thank-you') || 
                        currentPath.includes('/payment-verification') ||
                        currentPath.includes('/admin');
    
    if (!isPaymentPage) {
      // Don't run on non-payment pages
      return;
    }
  }
  
  console.log(`Running automated email recovery check`);
  
  try {
    // Find consultations that have completed payments but no confirmation email
    const { data: pendingEmails, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_status', 'completed')
      .eq('email_sent', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error(`Error checking for pending emails:`, error);
      return;
    }
    
    if (!pendingEmails || pendingEmails.length === 0) {
      console.log(`No pending emails found that need recovery`);
      return;
    }
    
    console.log(`Found ${pendingEmails.length} consultations needing email recovery`);
    
    // Process each consultation in sequence
    for (const consultation of pendingEmails) {
      try {
        const result = await recoverEmailByReferenceId(consultation.reference_id);
        if (result) {
          console.log(`Recovered email for ${consultation.reference_id}`);
        } else {
          console.error(`Failed to recover email for ${consultation.reference_id}`);
        }
        // Add delay between sends to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.error(`Error processing recovery for ${consultation.reference_id}:`, e);
      }
    }
  } catch (error) {
    console.error(`Error in automated email recovery:`, error);
  }
}

// Only expose functions to window if we're on a payment-related page
// This is now handled in consoleRecovery.ts
