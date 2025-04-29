
/**
 * Email utilities and services exports
 */

import { 
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails
} from './bookingEmailService';

import {
  sendContactEmail,
  resendContactEmail
} from './contactEmails';

// Re-export all email services
export {
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  retryFailedEmails,
  sendContactEmail,
  resendContactEmail
};
