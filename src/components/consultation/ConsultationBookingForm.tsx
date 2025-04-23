import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import BookingForm from './BookingForm';
import PaymentStep from './payment/PaymentStep';
import { getPackageName } from '@/utils/consultation/packageUtils';

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
    pricing,
    totalPrice,
    showPaymentStep,
    proceedToPayment,
    setShowPaymentStep,
    processPayment
  } = bookingState;

  // Check if test service is selected
  const isTestService = selectedServices.includes('test-service');

  // Calculate the effective price - hardcode for test service
  const effectivePrice = totalPrice;
  
  // Log pricing information for debugging
  useEffect(() => {
    console.log("ConsultationBookingForm isTestService:", isTestService);
    console.log("ConsultationBookingForm effectivePrice:", effectivePrice);
    console.log("ConsultationBookingForm totalPrice:", totalPrice);
    console.log("ConsultationBookingForm selectedServices:", selectedServices);
    
    // Check for package pricing
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      console.log(`Selected package: ${packageName}, packageId: ${packageId}, price: ${pricing?.get(packageId) || 'not found in pricing map'}`);
    }
  }, [pricing, totalPrice, effectivePrice, selectedServices, isTestService]);

  const handlePersonalDetailsFieldChange = useCallback((field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  }, [personalDetails, handlePersonalDetailsChange]);

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

  // Modified to handle single service selection
  const handleServiceSelection = useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service ${serviceId} selection changed to ${checked}`);
    
    if (checked && serviceId) {
      // Replace current selection with the new service
      setSelectedServices([serviceId]);
      console.log("New selected service:", serviceId);
    } else {
      // Clear selection if unchecked or empty
      setSelectedServices([]);
      console.log("Cleared service selection");
    }
  }, [setSelectedServices]);

  // Handle package selection
  const handlePackageSelection = useCallback((packageId: string) => {
    console.log(`Package ${packageId} selected`);
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      // For package selection in the radio group, we just use the package ID
      setSelectedServices([packageId]);
      console.log(`Selected package: ${packageId}`);
    }
  }, [holisticPackages, setSelectedServices]);

  useEffect(() => {
    // Get the current URL params to check if we came from a specific service page
    const urlParams = new URLSearchParams(window.location.search);
    const subServiceParam = urlParams.get('subservice');

    // Only run once when the component mounts and we have no selected services yet
    if (subServiceParam && selectedServices.length === 0) {
      // If we have a URL parameter but no selected services, select it
      console.log("Setting service from URL parameter:", subServiceParam);
      setSelectedServices([subServiceParam]);
    }
  }, []); // Removed selectedServices from dependency array to prevent loop

  // Handle payment form submission
  const handlePaymentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting payment with total price: ${effectivePrice}`);
    processPayment();
  }, [processPayment, effectivePrice]);

  // Format selected services for display
  const getFormattedConsultationType = useCallback(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return "Consultation";
    }
    return selectedServices[0]; // Only show the first (and only) selected service
  }, [selectedServices]);

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
              selectedServices={selectedServices}
              onNextStep={processPayment}
              onPrevStep={() => setShowPaymentStep(false)}
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
              totalPrice={effectivePrice}
              pricing={pricing}
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
            totalPrice={effectivePrice}
            onSubmit={proceedToPayment}
          />
        </Card>
      )}
    </div>
  );
};

export default React.memo(ConsultationBookingForm);
