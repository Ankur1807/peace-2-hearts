
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ConsultationDetailsForm from './ConsultationDetailsForm';
import { useBookingState } from './booking/useBookingState';
import PaymentStepContainer from './PaymentStepContainer';
import { Card } from '@/components/ui/card';

interface BookingFormContainerProps {
  bookingState: ConsultationBookingHook & {
    handlePaymentSubmit?: (e: React.FormEvent) => Promise<void>;
  };
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ bookingState }) => {
  const enrichedBookingState = useBookingState(bookingState);
  
  // Extract required properties for ConsultationDetailsForm
  const {
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    personalDetails,
    handlePersonalDetailsChange,
    isProcessing,
    setIsProcessing,
    pricing,
    totalPrice,
    proceedToPayment,
    showPaymentStep,
    setShowPaymentStep,
    processPayment
  } = enrichedBookingState;
  
  // Debug to verify pricing data is available
  React.useEffect(() => {
    console.log('BookingFormContainer rendered with pricing data:', {
      pricingAvailable: !!pricing,
      totalPrice,
      pricingSize: pricing ? pricing.size : 0,
      showPaymentStep
    });
  }, [pricing, totalPrice, showPaymentStep]);
  
  // Handle form submission
  const handleFormSubmit = React.useCallback(() => {
    console.log("Form submission in BookingFormContainer");
    if (bookingState.proceedToPayment) {
      console.log("Calling proceedToPayment from BookingFormContainer");
      bookingState.proceedToPayment();
    } else {
      console.error("proceedToPayment function not available");
    }
  }, [bookingState]);
  
  // Handle payment submission  
  const handlePaymentSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment submission in BookingFormContainer");
    if (bookingState.processPayment) {
      console.log("Processing payment from BookingFormContainer");
      bookingState.processPayment();
    } else {
      console.error("processPayment function not available");
    }
  }, [bookingState]);
  
  // Handle service selection
  const handleServiceSelection = React.useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service selection: ${serviceId}, checked: ${checked}`);
    if (checked) {
      setSelectedServices([serviceId]);
    } else {
      setSelectedServices([]);
    }
  }, [setSelectedServices]);
  
  // Handle package selection (sets multiple services)
  const handlePackageSelection = React.useCallback((packageId: string) => {
    console.log(`Package selection: ${packageId}`);
    if (packageId === 'divorce-prevention') {
      setSelectedServices(['divorce-prevention']);
    } else if (packageId === 'pre-marriage-clarity') {
      setSelectedServices(['pre-marriage-clarity']);
    }
  }, [setSelectedServices]);
  
  // Handle personal details changes
  const handlePersonalDetailsFieldChange = React.useCallback((field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  }, [handlePersonalDetailsChange, personalDetails]);
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
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
          <ConsultationDetailsForm 
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
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
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default BookingFormContainer;
