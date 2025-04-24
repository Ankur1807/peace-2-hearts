
import React from 'react';
import { Card } from '@/components/ui/card';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import BookingForm from './BookingForm';
import PaymentStepContainer from './PaymentStepContainer';

interface BookingFormContentProps {
  bookingState: ConsultationBookingHook;
}

const BookingFormContent: React.FC<BookingFormContentProps> = ({ bookingState }) => {
  const {
    serviceCategory,
    setServiceCategory,
    selectedServices,
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    personalDetails,
    handlePersonalDetailsChange,
    isProcessing,
    pricing,
    totalPrice,
    setTotalPrice,
    proceedToPayment,
    processPayment,
    showPaymentStep,
    setShowPaymentStep
  } = bookingState;
  
  // Handle service selection
  const handleServiceSelection = (serviceId: string, checked: boolean) => {
    console.log(`Service selection: ${serviceId}, checked: ${checked}`);
    if (checked) {
      bookingState.setSelectedServices([serviceId]);
    } else {
      bookingState.setSelectedServices([]);
    }
  };
  
  // Handle package selection (sets multiple services)
  const handlePackageSelection = (packageId: string) => {
    console.log(`Package selection: ${packageId}`);
    if (packageId === 'divorce-prevention') {
      bookingState.setSelectedServices(['divorce-prevention']);
    } else if (packageId === 'pre-marriage-clarity') {
      bookingState.setSelectedServices(['pre-marriage-clarity']);
    }
  };
  
  // Handle personal details changes
  const handlePersonalDetailsFieldChange = (field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };
  
  // Handle form submission - we need to make this compatible with the expected signature
  const handleFormSubmit = () => {
    proceedToPayment();
  };
  
  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment();
  };
  
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-gradient-to-bl from-peacefulBlue/10 to-transparent rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-gradient-to-tr from-vividPink/10 to-transparent rounded-full filter blur-3xl"></div>
      
      {showPaymentStep ? (
        <Card className="backdrop-blur-sm bg-white/80 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <PaymentStepContainer
            consultationType={serviceCategory}
            selectedServices={selectedServices}
            processPayment={processPayment}
            setShowPaymentStep={setShowPaymentStep}
            handlePaymentSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
            pricing={pricing || new Map()}
            totalPrice={totalPrice}
          />
        </Card>
      ) : (
        <Card className="backdrop-blur-sm bg-white/80 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <BookingForm
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            selectedServices={selectedServices}
            handleServiceSelection={handleServiceSelection}
            handlePackageSelection={handlePackageSelection}
            date={date}
            setDate={setDate}
            timeSlot={timeSlot}
            setTimeSlot={setTimeSlot}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            personalDetails={personalDetails}
            handlePersonalDetailsFieldChange={handlePersonalDetailsFieldChange}
            isProcessing={isProcessing}
            pricing={pricing || new Map()}
            totalPrice={totalPrice}
            onSubmit={handleFormSubmit} // Modified to match the expected signature
          />
        </Card>
      )}
    </div>
  );
};

export default BookingFormContent;
