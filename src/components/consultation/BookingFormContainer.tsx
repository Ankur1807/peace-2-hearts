
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ConsultationBookingForm from './ConsultationBookingForm';
import WaveBackground from '@/components/WaveBackground';

interface BookingFormContainerProps {
  bookingState: ConsultationBookingHook;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ bookingState }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-vibrantPurple/20 to-peacefulBlue/20">
      <WaveBackground className="opacity-30" />
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ConsultationBookingForm bookingState={bookingState} />
        </div>
      </div>
    </div>
  );
};

export default BookingFormContainer;
