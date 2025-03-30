
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useConsultationBooking } from '@/hooks/useConsultationBooking';
import { initializeBookingFromStorage } from '@/utils/bookingInitializer';
import ConsultationBookingForm from '@/components/consultation/ConsultationBookingForm';
import SuccessView from '@/components/consultation/SuccessView';
import ConsultationAlert from '@/components/consultation/ConsultationAlert';
import { Toaster } from '@/components/ui/toaster';

const BookConsultation = () => {
  const bookingState = useConsultationBooking();
  const { submitted, referenceId, bookingError } = bookingState;
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === 'development');
    initializeBookingFromStorage(bookingState);
  }, []);

  if (submitted) {
    return (
      <>
        <SEO 
          title="Consultation Confirmed"
          description="Your consultation with Peace2Hearts has been successfully booked. We look forward to supporting you on your relationship journey."
          keywords="book relationship counseling, legal consultation appointment, therapy session, mental health support"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <SuccessView referenceId={referenceId} />
          </div>
        </main>
        <Footer />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Book a Consultation"
        description="Schedule a consultation with our relationship counselors or legal experts. Take the first step towards peace and clarity in your relationship journey."
        keywords="book relationship counseling, legal consultation appointment, therapy session, mental health support"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-4">Book Your Consultation</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Take the first step towards peace and clarity in your relationship journey. Our expert team is here to support you.
          </p>

          {bookingError && (
            <ConsultationAlert
              title="Booking Error"
              description={bookingError}
              variant="destructive"
              className="mb-6"
            />
          )}

          {isDevelopment && (
            <ConsultationAlert
              title="Development Mode"
              description="This is a development environment. Bookings will create consultants if none exist."
              variant="default"
              className="mb-6"
            />
          )}

          <ConsultationBookingForm bookingState={bookingState} />
        </div>
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default BookConsultation;
