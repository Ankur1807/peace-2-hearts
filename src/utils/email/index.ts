
/**
 * Email Service
 * 
 * This file handles email-related functionality and re-exports from specialized modules.
 */

// Import booking email services
import { 
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails
} from './bookingEmailService';

// Import contact email services
import { 
  sendContactEmail, 
  resendContactEmail 
} from './contactEmailService';

// Export all email-related functions
export {
  // Booking email functions
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails,
  
  // Contact email functions
  sendContactEmail,
  resendContactEmail
};
