
// This file is kept for backwards compatibility
// It re-exports all the email functionality from the new modular structure

import {
  sendContactEmail,
  resendContactEmail,
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail
} from './email';

export {
  sendContactEmail,
  resendContactEmail,
  sendBookingConfirmationEmail,
  resendBookingConfirmationEmail
};
