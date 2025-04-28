
/**
 * Razorpay Integration Service
 * 
 * This file serves as the main entry point for all Razorpay payment functionalities
 * and re-exports from specialized service modules.
 */
import { BookingDetails } from "@/utils/types";

// Re-export from specialized services
import { loadRazorpayScript, isRazorpayAvailable } from "./razorpayLoader";
import { createRazorpayOrder } from "./services/paymentOrderService";
import { verifyRazorpayPayment, verifyAndSyncPayment } from "./services/paymentVerificationService";
import { updateConsultationStatus } from "./services/serviceUtils";
import { sendEmailForConsultation } from "./services/emailNotificationService";
import { storePaymentDetailsInSession } from "./services/paymentStorageService";

// Re-export types for compatibility with existing code
export type { CreateOrderParams, OrderResponse, VerifyPaymentParams } from './razorpayTypes';

// Export all payment-related functions
export {
  // Script loading utilities
  loadRazorpayScript,
  isRazorpayAvailable,
  
  // Order creation
  createRazorpayOrder,
  
  // Payment verification
  verifyRazorpayPayment,
  verifyAndSyncPayment,
  
  // Consultation and email services
  updateConsultationStatus,
  sendEmailForConsultation,
  
  // Storage services
  storePaymentDetailsInSession
};

// Add missing import for supabase
import { supabase } from "@/integrations/supabase/client";
import { determineServiceCategory } from "./services/serviceUtils";

/**
 * Simple function to update consultation with payment information
 */
export async function savePaymentRecord(params: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
}): Promise<boolean> {
  try {
    const { referenceId, paymentId, orderId, amount, status = 'completed' } = params;
    console.log(`Saving payment record for consultation: ${referenceId}`);
    
    // Update the consultation status and payment information
    const statusUpdated = await updateConsultationStatus(
      referenceId, 
      status, 
      paymentId, 
      amount, 
      orderId
    );
    
    if (statusUpdated) {
      // Create booking details for email
      const { data: consultation } = await supabase
        .from('consultations')
        .select('*')
        .eq('reference_id', referenceId)
        .single();
        
      if (consultation) {
        // Send email notification
        const serviceCategory = determineServiceCategory(consultation.consultation_type);
        
        const bookingDetails: BookingDetails = {
          referenceId,
          clientName: consultation.client_name || 'Client',
          email: consultation.client_email || 'client@example.com',
          consultationType: consultation.consultation_type || 'general',
          services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
          serviceCategory,
          highPriority: true
        };
        
        await sendEmailForConsultation(bookingDetails);
      }
    }
    
    return statusUpdated;
  } catch (error) {
    console.error("Error saving payment record:", error);
    return false;
  }
}
