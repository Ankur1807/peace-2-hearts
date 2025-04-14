
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ConsultationBookingForm from './ConsultationBookingForm';

interface BookingFormContainerProps {
  bookingState: ConsultationBookingHook;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ bookingState }) => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="section-title text-4xl md:text-5xl text-center mb-4">Book Your Consultation</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Take the first step towards peace and clarity in your relationship journey. Our expert team is here to support you.
      </p>
      
      <ConsultationBookingForm bookingState={bookingState} />
    </div>
  );
};

export default BookingFormContainer;
