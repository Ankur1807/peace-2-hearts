
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePaymentVerification } from '@/hooks/payment/usePaymentVerification';
import { BookingDetails } from '@/utils/types';
import PaymentVerificationLoader from '@/components/consultation/payment/PaymentVerificationLoader';
import { useToast } from '@/hooks/use-toast';
import PaymentProcessingLoader from '@/components/consultation/payment/PaymentProcessingLoader';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Get parameters from URL search params first, then fall back to location state
  const referenceId = searchParams.get('ref') || location.state?.referenceId || null;
  const paymentId = searchParams.get('pid') || location.state?.paymentId || null;
  
  const { 
    orderId, 
    signature, 
    amount, 
    bookingDetails,
    isVerifying: initiallyVerifying = false
  } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [manualVerification, setManualVerification] = useState(false);
  const [showProcessingScreen, setShowProcessingScreen] = useState(true);
  
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
    if (!paymentId && !location.state && !referenceId) {
      console.log('No payment data found, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [paymentId, location.state, navigate, referenceId]);

  // CRITICAL FIX: Add logging to debug ref parameter and ensure it's being passed
  useEffect(() => {
    console.log('PaymentVerification loaded with:', {
      referenceId, 
      paymentId, 
      fromParams: !!searchParams.get('ref'),
      fromState: !!(location.state?.referenceId),
      queryString: window.location.search
    });
  }, [referenceId, paymentId, searchParams, location.state]);

  // Automatically redirect to the thank-you page with query parameters
  useEffect(() => {
    if (paymentId && !isVerifying && !initiallyVerifying) {
      const timer = setTimeout(() => {
        // CRITICAL FIX: Ensure the ref parameter is ALWAYS included
        if (!referenceId) {
          console.error("ERROR: Missing reference ID for thank you redirect!");
        }
        
        const searchParams = new URLSearchParams();
        if (referenceId) searchParams.set('ref', referenceId);
        if (paymentId) searchParams.set('pid', paymentId);
        
        const redirectPath = `/thank-you?${searchParams.toString()}`;
        console.log(`Redirecting to thank-you page: ${redirectPath}`);
        
        navigate(redirectPath, {
          state: {
            referenceId,
            paymentId,
            orderId,
            signature,
            amount,
            bookingDetails
          },
          replace: true
        });
        
        setShowProcessingScreen(false);
      }, 3000); // Short delay to show the processing screen
      
      return () => clearTimeout(timer);
    }
  }, [isVerifying, initiallyVerifying, paymentId, navigate, orderId, signature, referenceId, bookingDetails, amount]);

  // Try manual verification if needed
  const handleManualVerification = () => {
    setManualVerification(true);
    
    // CRITICAL FIX: Always check and log if ref is missing
    if (!referenceId) {
      console.error("ERROR: Missing reference ID for manual verification!");
    }
    
    // Navigate to confirmation page with query parameters
    const searchParams = new URLSearchParams();
    if (referenceId) searchParams.set('ref', referenceId);
    if (paymentId) searchParams.set('pid', paymentId);
    
    const redirectPath = `/payment-confirmation?${searchParams.toString()}`;
    console.log(`Navigating to manual verification: ${redirectPath}`);
    
    navigate(redirectPath, {
      state: {
        referenceId,
        paymentId,
        orderId,
        amount
      },
      replace: true
    });
    
    toast({
      title: "Recovery Started",
      description: "We're trying to recover your booking information."
    });
  };

  // Full-screen processing loader to prevent user from going back/refreshing
  if (showProcessingScreen) {
    return <PaymentProcessingLoader />;
  }

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
            You'll be redirected to the confirmation page in a moment.
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
              onClick={() => {
                // CRITICAL FIX: Always include ref in the redirect
                const searchParams = new URLSearchParams();
                if (referenceId) searchParams.set('ref', referenceId);
                if (paymentId) searchParams.set('pid', paymentId);
                
                const redirectPath = `/payment-confirmation?${searchParams.toString()}`;
                console.log(`Navigating to payment confirmation: ${redirectPath}`);
                
                navigate(redirectPath, { 
                  state: {
                    referenceId,
                    paymentId,
                    orderId,
                    amount
                  },
                  replace: true 
                });
              }}
              className="w-full bg-peacefulBlue hover:bg-peacefulBlue/80"
            >
              View Booking Details
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
