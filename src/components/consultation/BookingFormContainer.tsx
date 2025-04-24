
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ConsultationDetailsForm from './ConsultationDetailsForm';
import { useBookingState } from './booking/useBookingState';

interface BookingFormContainerProps {
  bookingState: ConsultationBookingHook;
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
    pricing,
    totalPrice,
    handleConfirmBooking
  } = enrichedBookingState;
  
  // Debug to verify pricing data is available
  React.useEffect(() => {
    console.log('BookingFormContainer rendered with pricing data:', {
      pricingAvailable: !!pricing,
      totalPrice,
      pricingSize: pricing ? pricing.size : 0
    });
  }, [pricing, totalPrice]);
  
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
          onSubmit={handleConfirmBooking}
        />
      </div>
    </div>
  );
};

export default BookingFormContainer;
