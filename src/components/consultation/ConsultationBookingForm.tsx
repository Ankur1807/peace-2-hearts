
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import BookingFormContent from './booking/BookingFormContent';
import PaymentStepContainer from './PaymentStepContainer';
import { Card } from '@/components/ui/card';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    showPaymentStep,
    setShowPaymentStep,
    selectedServices,
    processPayment,
    isProcessing,
    pricing,
    totalPrice
  } = bookingState;

  const getFormattedConsultationType = () => {
    if (!selectedServices || selectedServices.length === 0) {
      return "Consultation";
    }
    return selectedServices[0];
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting payment with total price: ${totalPrice}`);
    processPayment();
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-gradient-to-bl from-peacefulBlue/10 to-transparent rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-gradient-to-tr from-vividPink/10 to-transparent rounded-full filter blur-3xl"></div>
      
      {showPaymentStep ? (
        <Card className="backdrop-blur-sm bg-white/80 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <PaymentStepContainer
            consultationType={getFormattedConsultationType()}
            selectedServices={selectedServices}
            processPayment={processPayment}
            setShowPaymentStep={setShowPaymentStep}
            handlePaymentSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
            totalPrice={totalPrice}
            pricing={pricing}
          />
        </Card>
      ) : (
        <BookingFormContent bookingState={bookingState} />
      )}
    </div>
  );
};

export default React.memo(ConsultationBookingForm);
