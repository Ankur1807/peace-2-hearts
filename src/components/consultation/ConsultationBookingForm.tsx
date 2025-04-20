
import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import BookingForm from './BookingForm';
import PaymentStep from './payment/PaymentStep';

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

  // Log pricing information for debugging
  console.log("ConsultationBookingForm pricing data:", Object.fromEntries(pricing));
  console.log("ConsultationBookingForm totalPrice:", totalPrice);
  console.log("ConsultationBookingForm selectedServices:", selectedServices);

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
      services: ['pre-marriage-legal', 'premarital-counselling-individual', 'mental-health-counselling'] 
    }
  ];

  // Improved service selection handler using useCallback to prevent recreations
  const handleServiceSelection = useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service ${serviceId} selection changed to ${checked}`);
    
    setSelectedServices(prevServices => {
      if (checked) {
        // Add the service if it's not already in the list
        if (!prevServices.includes(serviceId)) {
          const newServices = [...prevServices, serviceId];
          console.log("New selected services:", newServices);
          return newServices;
        }
        return prevServices;
      } else {
        // Remove the service
        const newServices = prevServices.filter(id => id !== serviceId);
        console.log("New selected services after removal:", newServices);
        return newServices;
      }
    });
  }, [setSelectedServices]);

  const handlePackageSelection = useCallback((packageId: string) => {
    console.log(`Package ${packageId} selected`);
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      console.log(`Setting services from package:`, selectedPackage.services);
      setSelectedServices(selectedPackage.services);
    }
  }, [holisticPackages, setSelectedServices]);

  // FIXED: Remove dependency on selectedServices to prevent infinite loop
  useEffect(() => {
    // Get the current URL params to check if we came from a specific service page
    const urlParams = new URLSearchParams(window.location.search);
    const subServiceParam = urlParams.get('subservice');

    // Only run once when the component mounts
    if (subServiceParam && selectedServices.length === 0) {
      // If we have a URL parameter but no selected services, select it
      console.log("Setting service from URL parameter:", subServiceParam);
      setSelectedServices([subServiceParam]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedServices]); // FIXED: removed selectedServices from dependency array

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment();
  };

  // Format selected services for display
  const getFormattedConsultationType = () => {
    if (!selectedServices || selectedServices.length === 0) {
      return "Consultation";
    }
    return selectedServices.join(', ');
  };

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-gradient-to-bl from-peacefulBlue/10 to-transparent rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-gradient-to-tr from-vividPink/10 to-transparent rounded-full filter blur-3xl"></div>
      
      {showPaymentStep ? (
        <Card className="backdrop-blur-sm bg-white/80 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <PaymentStep 
              consultationType={getFormattedConsultationType()}
              onNextStep={processPayment}
              onPrevStep={() => setShowPaymentStep(false)}
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
              totalPrice={totalPrice}
            />
          </form>
        </Card>
      ) : (
        <Card className="backdrop-blur-sm bg-white/90 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-3 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-peacefulBlue to-vividPink">
              Book Your Consultation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take the first step towards peace and clarity in your relationship journey with our expert guidance.
            </p>
          </div>
          
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
      )}
    </div>
  );
};

export default ConsultationBookingForm;
