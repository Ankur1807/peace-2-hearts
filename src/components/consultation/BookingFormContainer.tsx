
import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ConsultationBookingForm from './ConsultationBookingForm';

interface BookingFormContainerProps {
  bookingState: ConsultationBookingHook;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ bookingState }) => {
  return (
    <div className="ocean-pattern py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-peacefulBlue/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-vividPink/10 rounded-full filter blur-3xl"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-lora font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-peacefulBlue to-vividPink">
            Book Your Consultation
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Take the first step towards peace and clarity in your relationship journey. 
            Our expert team is here to support you with professional guidance.
          </p>
        </div>
        
        <ConsultationBookingForm bookingState={bookingState} />
        
        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by clients across India</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-peacefulBlue mr-2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-gray-700">Secure Booking</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-peacefulBlue mr-2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="text-gray-700">Expert Care</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-peacefulBlue mr-2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="text-gray-700">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormContainer;
