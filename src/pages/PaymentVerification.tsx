
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentVerificationLoader from '@/components/consultation/payment/PaymentVerificationLoader';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If somehow we got here without payment data, redirect to home
    if (!location.state?.paymentId) {
      navigate('/');
      return;
    }
    
    // Add a minimum delay to show the loader
    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
    
    const verificationComplete = new CustomEvent('verificationComplete', {
      detail: location.state
    });
    
    // Wait for the minimum delay before proceeding
    minDelay.then(() => {
      window.dispatchEvent(verificationComplete);
    });
  }, [location.state, navigate]);
  
  return <PaymentVerificationLoader />;
};

export default PaymentVerification;
