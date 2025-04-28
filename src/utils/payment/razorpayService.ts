
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
import { storePaymentDetailsInSession, getPaymentDetailsFromSession } from "./services/paymentStorageService";

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
  storePaymentDetailsInSession,
  getPaymentDetailsFromSession
};

// Simple function to complete the payment record
export async function savePaymentRecord(params: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
}): Promise<boolean> {
  try {
    const { referenceId, status = 'completed' } = params;
    console.log(`Saving payment record for consultation: ${referenceId}`);
    
    // Now we just update the consultation status directly
    const statusUpdated = await updateConsultationStatus(referenceId, status);
    
    if (statusUpdated) {
      // Send email notification
      await sendEmailForConsultation(null, {
        referenceId,
        highPriority: true
      });
    }
    
    return statusUpdated;
  } catch (error) {
    console.error("Error saving payment record:", error);
    return false;
  }
}
