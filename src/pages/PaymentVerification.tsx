
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePaymentVerification } from '@/hooks/payment/usePaymentVerification';
import { BookingDetails } from '@/utils/types';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    paymentId, 
    orderId, 
    signature, 
    amount, 
    referenceId,
    bookingDetails 
  } = location.state || {};
  
  const {
    isVerifying,
    verificationResult
  } = usePaymentVerification({
    paymentId,
    orderId, 
    signature,
    amount: amount || 0,
    referenceId
  });

  // Redirect to home if no payment data
  useEffect(() => {
    if (!paymentId && !location.state) {
      navigate('/', { replace: true });
    }
  }, [paymentId, location.state, navigate]);

  // Create booking details object from location state
  const getBookingDetails = (): BookingDetails | undefined => {
    if (!bookingDetails) return undefined;
    
    return {
      clientName: bookingDetails.clientName,
      email: bookingDetails.email,
      referenceId: referenceId || '',
      consultationType: bookingDetails.consultationType || '',
      services: bookingDetails.services || [],
      serviceCategory: bookingDetails.serviceCategory,
      date: bookingDetails.date ? new Date(bookingDetails.date) : undefined,
      timeSlot: bookingDetails.timeSlot,
      timeframe: bookingDetails.timeframe,
      message: bookingDetails.message,
      amount: amount
    };
  };

  if (isVerifying) {
    return (
      <>
        <SEO title="Verifying Payment" description="Verifying your payment" />
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-white/70">
            <Loader2 className="h-12 w-12 text-peacefulBlue mx-auto animate-spin mb-6" />
            <h1 className="text-2xl font-semibold mb-4">Verifying Your Payment</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your payment and complete your booking.
            </p>
            <p className="text-sm text-gray-500">
              Payment ID: {paymentId}
              <br />
              Reference: {referenceId}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (verificationResult?.success) {
    return (
      <>
        <SEO title="Payment Successful" description="Your payment was successful and your booking has been confirmed" />
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-white/70">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-semibold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed and a confirmation email has been sent to your email address.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm">
                <strong>Booking Reference:</strong> {referenceId}<br />
                <strong>Payment ID:</strong> {paymentId}<br />
                {bookingDetails && (
                  <>
                    <strong>Service:</strong> {bookingDetails.consultationType}<br />
                    {bookingDetails.date && (
                      <><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}<br /></>
                    )}
                    {bookingDetails.timeSlot && (
                      <><strong>Time:</strong> {bookingDetails.timeSlot}<br /></>
                    )}
                    {bookingDetails.timeframe && (
                      <><strong>Timeframe:</strong> {bookingDetails.timeframe}<br /></>
                    )}
                  </>
                )}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="bg-peacefulBlue hover:bg-peacefulBlue/80"
            >
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Payment Verification Failed" description="There was an issue verifying your payment" />
      <Navigation />
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-white/70">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-4">Payment Verification Issue</h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your payment. If the amount was deducted from your account,
            please contact us with the details below.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm mb-2"><strong>Payment ID:</strong> {paymentId}</p>
            <p className="text-sm"><strong>Reference:</strong> {referenceId}</p>
          </div>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Button 
              onClick={() => navigate('/book-consultation')}
              variant="outline"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              className="bg-peacefulBlue hover:bg-peacefulBlue/80"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVerification;
