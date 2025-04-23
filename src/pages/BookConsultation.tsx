import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useConsultationBooking } from '@/hooks/useConsultationBooking';
import { Toaster } from '@/components/ui/toaster';
import { BookingDetails } from '@/utils/types';
import BookingSuccessView from '@/components/consultation/BookingSuccessView';
import BookingFormContainer from '@/components/consultation/BookingFormContainer';
import ConsultationInitializer from '@/components/consultation/ConsultationInitializer';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { useNavigate } from 'react-router-dom';

const BookConsultation = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const subServiceParam = searchParams.get('subservice');
  
  const bookingState = useConsultationBooking();
  const { 
    submitted, 
    referenceId,
    date,
    timeSlot,
    timeframe,
    serviceCategory,
    selectedServices,
    personalDetails,
    totalPrice
  } = bookingState;

  const navigate = useNavigate();

  const createBookingDetails = (): BookingDetails => ({
    clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
    email: personalDetails.email,
    services: selectedServices || [], 
    date: date, 
    timeSlot: timeSlot,
    timeframe: timeframe,
    serviceCategory: serviceCategory,
    packageName: getPackageName(selectedServices),
    amount: totalPrice
  });

  React.useEffect(() => {
    if (submitted && referenceId) {
      navigate("/payment-confirmation", {
        state: {
          referenceId,
          bookingDetails: createBookingDetails()
        },
        replace: true
      });
    }
  }, [submitted, referenceId]);

  if (submitted && referenceId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg">Redirecting to confirmation page...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={submitted ? "Consultation Confirmed" : "Book a Consultation"}
        description={submitted 
          ? "Your consultation with Peace2Hearts has been successfully booked. We look forward to supporting you on your relationship journey."
          : "Schedule a consultation with our relationship counselors or legal experts. Take the first step towards peace and clarity in your relationship journey."
        }
        keywords="book relationship counseling, legal consultation appointment, therapy session, mental health support"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        {!submitted ? (
          <>
            <ConsultationInitializer 
              serviceParam={serviceParam}
              subServiceParam={subServiceParam}
              bookingState={bookingState}
            />
            <BookingFormContainer bookingState={bookingState} />
          </>
        ) : (
          <BookingSuccessView 
            referenceId={referenceId}
            bookingDetails={createBookingDetails()}
          />
        )}
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default BookConsultation;
