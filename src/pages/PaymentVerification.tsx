
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { usePaymentVerification } from '@/hooks/payment/usePaymentVerification';
import { BookingDetails } from '@/utils/types';
import PaymentVerificationLoader from '@/components/consultation/payment/PaymentVerificationLoader';
import { useToast } from '@/hooks/use-toast';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    paymentId, 
    orderId, 
    signature, 
    amount, 
    referenceId,
    bookingDetails,
    isVerifying: initiallyVerifying = false,
    verificationFailed = false
  } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [manualVerification, setManualVerification] = useState(false);
  const [redirectTime, setRedirectTime] = useState(3); // seconds to redirect
  
  const {
    isVerifying,
    verificationResult
  } = usePaymentVerification({
    setIsProcessing,
    setPaymentCompleted,
    paymentId,
    orderId,
    signature,
    amount,
    referenceId,
    bookingDetails
  });

  // Redirect to home if no payment data
  useEffect(() => {
    if (!paymentId && !location.state) {
      navigate('/', { replace: true });
    }
  }, [paymentId, location.state, navigate]);

  // Automatically redirect to the confirmation page after short timeout
  useEffect(() => {
    // Only start the countdown when verification is complete
    if (!isVerifying && !initiallyVerifying) {
      const timer = setInterval(() => {
        setRedirectTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigateToConfirmation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isVerifying, initiallyVerifying]);

  // Function to navigate to confirmation page
  const navigateToConfirmation = () => {
    navigate('/payment-confirmation', {
      state: {
        paymentId,
        orderId,
        signature,
        referenceId,
        amount,
        bookingDetails,
        verificationResult,
        verificationFailed
      },
      replace: true
    });
  };

  // Try manual verification if needed
  const handleManualVerification = () => {
    setManualVerification(true);
    
    // Navigate to confirmation page with available data
    navigate('/payment-confirmation', {
      state: {
        paymentId,
        orderId,
        referenceId,
        amount,
        bookingDetails,
        needsRecovery: true
      },
      replace: true
    });
    
    toast({
      title: "Recovery Started",
      description: "We're trying to recover your booking information."
    });
  };

  if (isVerifying || isProcessing) {
    return (
      <>
        <SEO title="Verifying Payment" description="Verifying your payment" />
        <Navigation />
        <PaymentVerificationLoader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Payment Processed" description="Your payment has been processed" />
      <Navigation />
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-white/70">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-4">Payment Processed!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been received and your booking information is being saved.
            You'll be redirected to the confirmation page in {redirectTime} {redirectTime === 1 ? 'second' : 'seconds'}.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm">
              <strong>Payment ID:</strong> {paymentId}<br />
              {referenceId && <><strong>Reference:</strong> {referenceId}<br /></>}
              <strong>Amount:</strong> ₹{amount}
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={navigateToConfirmation}
              className="w-full bg-peacefulBlue hover:bg-peacefulBlue/80"
            >
              View Confirmation Now
            </Button>
            
            {!manualVerification && (
              <Button 
                onClick={handleManualVerification}
                variant="outline" 
                className="w-full"
              >
                Manual Recovery
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVerification;
