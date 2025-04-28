
import { recoverEmailByReferenceId } from './payment/services/paymentVerificationService';
import { resendConfirmationEmail } from './payment/services/emailNotificationService';

// Expose recovery functions globally 
if (typeof window !== 'undefined') {
  // For manual email recovery via console
  // @ts-ignore
  window.recoverEmailByReferenceId = recoverEmailByReferenceId;
  
  // For resending confirmation emails
  // @ts-ignore
  window.resendConfirmationEmail = resendConfirmationEmail;
  
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
  
  console.log('Email recovery functions available in console:');
  console.log('- recoverEmailByReferenceId("YOUR_REFERENCE_ID")');
  console.log('- resendConfirmationEmail("YOUR_REFERENCE_ID")');
  console.log('- recoverLatestEmail() - tries to recover using the reference ID from the URL');
}

export {};
