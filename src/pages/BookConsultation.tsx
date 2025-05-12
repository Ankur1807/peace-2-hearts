import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useConsultationBooking } from '@/hooks/useConsultationBooking';
import { Toaster } from '@/components/ui/toaster';
import { BookingDetails } from '@/utils/types';
import BookingSuccessView from '@/components/consultation/BookingSuccessView';
import BookingFormContainer from '@/components/consultation/BookingFormContainer';
import ConsultationInitializer from '@/components/consultation/ConsultationInitializer';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const BookConsultation = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const subServiceParam = searchParams.get('subservice');
  
  const bookingState = useConsultationBooking();
  const { 
    submitted, 
    referenceId,
    date,
    timeSlot,
    timeframe,
    serviceCategory,
    selectedServices,
    personalDetails,
    totalPrice,
    showPaymentStep,
    setShowPaymentStep,
    isProcessing,
    setIsProcessing
  } = bookingState;

  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Track the current step in the UI for debugging
  const [debugState, setDebugState] = useState({
    showingPaymentStep: false
  });
  
  // Track state changes for debugging
  useEffect(() => {
    if (showPaymentStep !== debugState.showingPaymentStep) {
      console.log(`showPaymentStep changed from ${debugState.showingPaymentStep} to ${showPaymentStep}`);
      setDebugState(prev => ({ ...prev, showingPaymentStep: showPaymentStep }));
    }
  }, [showPaymentStep, debugState.showingPaymentStep]);

  // Scroll to top when payment step is shown
  useEffect(() => {
    if (showPaymentStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showPaymentStep]);

  const createBookingDetails = (): BookingDetails => ({
    clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
    email: personalDetails.email,
    referenceId: referenceId || '',
    consultationType: selectedServices.length > 1 ? 'multiple' : selectedServices[0] || serviceCategory,
    services: selectedServices || [], 
    date: date, 
    timeSlot: timeSlot,
    timeframe: timeframe,
    serviceCategory: serviceCategory,
    packageName: getPackageName(selectedServices),
    amount: totalPrice,
    message: personalDetails.message
  });

  React.useEffect(() => {
    if (submitted && referenceId) {
      console.log("Booking submitted successfully, navigating to confirmation page with:", {
        referenceId,
        bookingDetails: createBookingDetails()
      });
      
      navigate("/payment-confirmation", {
        state: {
          referenceId,
          bookingDetails: createBookingDetails()
        },
        replace: true
      });
    }
  }, [submitted, referenceId, navigate]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Payment form submitted from BookConsultation page");
      await bookingState.processPayment();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (submitted && referenceId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg">Redirecting to confirmation page...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Book a Consultation"
        description="Schedule a consultation with our relationship counselors or legal experts."
        keywords="book relationship counseling, legal consultation appointment, therapy session"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        {!submitted ? (
          <>
            <ConsultationInitializer 
              serviceParam={serviceParam}
              subServiceParam={subServiceParam}
              bookingState={bookingState}
            />
            <BookingFormContainer 
              bookingState={{
                ...bookingState,
                handlePaymentSubmit
              }}
            />
          </>
        ) : (
          <BookingSuccessView 
            referenceId={referenceId}
            bookingDetails={createBookingDetails()}
          />
        )}
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default BookConsultation;
