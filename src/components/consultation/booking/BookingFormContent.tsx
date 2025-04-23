
import React from 'react';
import { Card } from '@/components/ui/card';
import ConsultationFormHeader from '../ConsultationFormHeader';
import BookingErrorAlert from '../BookingErrorAlert';
import ConsultationDetailsForm from '../ConsultationDetailsForm';
import { useServiceHandlers } from './useServiceHandlers';
import { useBookingState } from './useBookingState';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';

interface BookingFormContentProps {
  bookingState: ConsultationBookingHook;
}

const BookingFormContent: React.FC<BookingFormContentProps> = ({ bookingState }) => {
  const state = useBookingState(bookingState);
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
    isProcessing,
    bookingError,
    personalDetails,
    handlePersonalDetailsChange,
    pricing,
    totalPrice,
    proceedToPayment
  } = state;

  const { handleServiceSelection, handlePackageSelection } = useServiceHandlers({
    setSelectedServices
  });

  return (
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
        handlePersonalDetailsFieldChange={(field: string, value: string) => 
          handlePersonalDetailsChange({
            ...personalDetails,
            [field]: value
          })
        }
        isProcessing={isProcessing}
        pricing={pricing}
        totalPrice={totalPrice}
        onSubmit={proceedToPayment}
      />
    </Card>
  );
};

export default BookingFormContent;
