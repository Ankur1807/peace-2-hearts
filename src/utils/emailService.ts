
// This file is kept for backwards compatibility
// It re-exports all the email functionality from the new modular structure

import {
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail,
  sendContactEmail,
  resendContactEmail
} from './email';

export {
  sendContactEmail,
  resendContactEmail,
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail
};
