
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
import { verifyRazorpayPayment, verifyAndSyncPayment, verifyAndRecordPayment } from "./services/paymentVerificationService";
import { updateConsultationStatus } from "./services/serviceUtils";
import { sendEmailForConsultation } from "./services/emailNotificationService";
import { storePaymentDetailsInSession } from "./services/paymentStorageService";
import { savePaymentRecord } from "./services/paymentRecordService";

// Export types for compatibility with existing code
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
  verifyAndRecordPayment,
  
  // Consultation and email services
  updateConsultationStatus,
  sendEmailForConsultation,
  
  // Storage services
  storePaymentDetailsInSession,
  savePaymentRecord
};

// Export the verifyPaymentAndCreateBooking for backward compatibility
export { verifyPaymentAndCreateBooking } from "@/utils/payment/verificationService";
