
/**
 * Email utilities and services exports
 */

import { 
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails
} from './bookingEmailService';

// Re-export email services
export {
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails
};
