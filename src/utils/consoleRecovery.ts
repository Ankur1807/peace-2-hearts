
import { recoverEmailByReferenceId } from './payment/services/paymentVerificationService';
import { resendBookingConfirmationEmail } from './email/bookingEmailService';

// Only expose recovery functions on payment-related pages
if (typeof window !== 'undefined') {
  const currentPath = window.location.pathname;
  
  // Only expose recovery functions on payment-related pages
  const isPaymentPage = currentPath.includes('/payment-confirmation') || 
                         currentPath.includes('/thank-you') || 
                         currentPath.includes('/payment-verification') ||
                         currentPath.includes('/admin');
  
  if (isPaymentPage) {
    // For manual email recovery via console - only on payment-related pages
    // @ts-ignore
    window.recoverEmailByReferenceId = recoverEmailByReferenceId;
    
    // For resending confirmation emails
    // @ts-ignore
    window.resendConsultationEmail = resendBookingConfirmationEmail;
    
    // Helper function to recover email for the latest payment
    // @ts-ignore
    window.recoverLatestEmail = async () => {
      // Get reference ID from URL or session storage
      const urlParams = new URLSearchParams(window.location.search);
      const refFromUrl = urlParams.get('ref');
      
      if (refFromUrl) {
        console.log(`Attempting to recover email for reference ID from URL: ${refFromUrl}`);
        return recoverEmailByReferenceId(refFromUrl);
      }
      
      console.error('No reference ID found in URL. Please use recoverEmailByReferenceId("YOUR_REFERENCE_ID") directly.');
      return false;
    };
    
    console.log('Email recovery functions available in console (on payment pages only):');
    console.log('- recoverEmailByReferenceId("YOUR_REFERENCE_ID")');
    console.log('- resendConsultationEmail("YOUR_REFERENCE_ID")');
    console.log('- recoverLatestEmail() - tries to recover using the reference ID from the URL');
  }
}

export {};
