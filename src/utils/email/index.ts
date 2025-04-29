
/**
 * Email Service - Main Export File
 * 
 * This file re-exports all email functionality from the modular files
 * for easy imports across the application.
 */

// Re-export booking email functions
export {
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails
} from './bookingEmailService';

// Export contact email functions from contactEmails.ts
export {
  sendContactEmail,
  resendContactEmail
} from './contactEmails';
