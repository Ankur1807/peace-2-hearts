
/**
 * Email Service
 * 
 * This file handles email-related functionality and re-exports from specialized modules.
 */
import { 
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference
} from './bookingEmailService';

import { 
  sendContactEmail, 
  resendContactEmail 
} from './contactEmailService';

export {
  // Booking email functions
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  fetchBookingDetailsByReference,
  
  // Contact email functions
  sendContactEmail,
  resendContactEmail
};
