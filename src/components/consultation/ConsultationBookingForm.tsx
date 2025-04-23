
import React, { useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import { getPackageName } from '@/utils/consultation/packageUtils';

import ConsultationFormHeader from './ConsultationFormHeader';
import BookingErrorAlert from './BookingErrorAlert';
import ConsultationDetailsForm from './ConsultationDetailsForm';
import PaymentStepContainer from './PaymentStepContainer';

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
    setTotalPrice,
    showPaymentStep,
    proceedToPayment,
    setShowPaymentStep,
    processPayment
  } = bookingState;

  const isTestService = selectedServices.includes('test-service');

  useEffect(() => {
    // Update total price based on current selection
    if (selectedServices.length > 0) {
      // Check if it's a package
      const packageName = getPackageName(selectedServices);
      if (packageName) {
        const packageId = packageName === "Divorce Prevention Package" 
          ? 'divorce-prevention' 
          : 'pre-marriage-clarity';
          
        // Check if we have price for this package
        if (pricing?.has(packageId)) {
          const packagePrice = pricing.get(packageId)!;
          console.log(`Setting total price to package price: ${packagePrice} for ${packageId}`);
          setTotalPrice(packagePrice);
        } else {
          console.log(`No pricing found for package ${packageId}, calculating from services`);
          // Calculate total from individual services
          let sum = 0;
          selectedServices.forEach(serviceId => {
            if (pricing?.has(serviceId)) {
              sum += pricing.get(serviceId)!;
            }
          });
          if (sum > 0) {
            // Apply 15% discount for packages
            const discountedSum = Math.round(sum * 0.85);
            console.log(`Calculated discounted package price: ${discountedSum} from sum ${sum}`);
            setTotalPrice(discountedSum);
          }
        }
      } else if (selectedServices.length === 1) {
        // Single service
        const serviceId = selectedServices[0];
        if (pricing?.has(serviceId)) {
          const servicePrice = pricing.get(serviceId)!;
          console.log(`Setting total price to service price: ${servicePrice} for ${serviceId}`);
          setTotalPrice(servicePrice);
        } else if (isTestService) {
          console.log('Setting test service default price: 11');
          setTotalPrice(11);
        }
      }
    } else {
      // No service selected
      setTotalPrice(0);
    }
  }, [selectedServices, pricing, setTotalPrice, isTestService]);

  useEffect(() => {
    console.log("ConsultationBookingForm pricing debug:", {
      selectedServices,
      totalPrice,
      pricingMap: pricing ? Object.fromEntries(pricing) : 'No pricing data'
    });
  }, [selectedServices, totalPrice, pricing]);

  const handlePersonalDetailsFieldChange = useCallback((field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  }, [personalDetails, handlePersonalDetailsChange]);

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

  const handleServiceSelection = useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service ${serviceId} selection changed to ${checked}`);
    if (checked && serviceId) {
      setSelectedServices([serviceId]);
      console.log("New selected service:", serviceId);
    } else {
      setSelectedServices([]);
      console.log("Cleared service selection");
    }
  }, [setSelectedServices]);

  const handlePackageSelection = useCallback((packageId: string) => {
    console.log(`Package ${packageId} selected`);
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSelectedServices([packageId]);
      console.log(`Selected package: ${packageId}`);
    }
  }, [holisticPackages, setSelectedServices]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subServiceParam = urlParams.get('subservice');
    if (subServiceParam && selectedServices.length === 0) {
      console.log("Setting service from URL parameter:", subServiceParam);
      setSelectedServices([subServiceParam]);
    }
  }, []); 

  const handlePaymentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting payment with total price: ${totalPrice}`);
    processPayment();
  }, [processPayment, totalPrice]);

  const getFormattedConsultationType = useCallback(() => {
    if (!selectedServices || selectedServices.length === 0) {
      return "Consultation";
    }
    return selectedServices[0];
  }, [selectedServices]);

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
        <Card className="backdrop-blur-sm bg-white/90 p-6 md:p-8 border border-gray-100 shadow-xl rounded-xl relative z-10">
          <ConsultationFormHeader />
          <BookingErrorAlert error={bookingError} />
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
            pricing={pricing}
            totalPrice={totalPrice}
            onSubmit={proceedToPayment}
          />
        </Card>
      )}
    </div>
  );
};

export default React.memo(ConsultationBookingForm);
