
import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import BookingForm from './BookingForm';
import PaymentStep from './PaymentStep';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    date, 
    setDate,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    isProcessing,
    bookingError,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking,
    pricing,
    totalPrice,
    showPaymentStep,
    proceedToPayment,
    setShowPaymentStep,
    processPayment
  } = bookingState;

  const handlePersonalDetailsFieldChange = (field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };

  // Define holisticPackages here to make them available for handlePackageSelection
  const holisticPackages = [
    { 
      id: 'divorce-prevention', 
      label: 'Divorce Prevention Package', 
      description: '4 sessions (2 therapy + 1 mediation + 1 legal)',
      services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
    },
    { 
      id: 'pre-marriage-clarity', 
      label: 'Pre-Marriage Clarity Package', 
      description: '3 sessions (1 legal + 2 mental health)',
      services: ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'] 
    }
  ];

  // Improved service selection handler using useCallback to prevent recreations
  const handleServiceSelection = useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service ${serviceId} selection changed to ${checked}`);
    
    setSelectedServices(prevServices => {
      if (checked) {
        // Add the service if it's not already in the list
        if (!prevServices.includes(serviceId)) {
          return [...prevServices, serviceId];
        }
        return prevServices;
      } else {
        // Remove the service
        return prevServices.filter(id => id !== serviceId);
      }
    });
  }, [setSelectedServices]);

  const handlePackageSelection = useCallback((packageId: string) => {
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSelectedServices(selectedPackage.services);
    }
  }, [holisticPackages, setSelectedServices]);

  // Only reset services when the category actually changes
  useEffect(() => {
    setSelectedServices([]);
  }, [serviceCategory, setSelectedServices]);

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment();
  };

  if (showPaymentStep) {
    return (
      <Card className="p-6 md:p-8">
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <PaymentStep 
            consultationType={selectedServices.join(', ')}
            onNextStep={processPayment}
            onPrevStep={() => setShowPaymentStep(false)}
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
            totalPrice={totalPrice}
          />
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-lora font-semibold mb-6">Book Your Consultation</h2>
      
      {bookingError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-medium">Error: {bookingError}</p>
        </div>
      )}
      
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
        pricing={pricing}
        totalPrice={totalPrice}
        onSubmit={proceedToPayment}
      />
    </Card>
  );
};

export default ConsultationBookingForm;
