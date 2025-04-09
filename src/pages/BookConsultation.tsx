
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
import { BookingDetails } from '@/utils/types';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const BookConsultation = () => {
  const bookingState = useConsultationBooking();
  const { 
    submitted, 
    referenceId, 
    bookingError,
    date,
    timeSlot,
    timeframe,
    serviceCategory,
    selectedServices,
    personalDetails,
    totalPrice,
    pricing
  } = bookingState;
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(true);

  // Function to determine package name based on selected services
  const getPackageName = () => {
    if (serviceCategory !== 'holistic') return null;
    
    // Divorce Prevention Package services
    const divorcePrevention = [
      'couples-counselling',
      'mental-health-counselling',
      'mediation',
      'general-legal'
    ];
    
    // Pre-Marriage Clarity Package services
    const preMarriageClarity = [
      'pre-marriage-legal',
      'premarital-counselling',
      'mental-health-counselling'
    ];

    // Check if selected services match a package
    const services = selectedServices || [];
    
    if (services.length === divorcePrevention.length && 
        divorcePrevention.every(s => services.includes(s))) {
      return "Divorce Prevention Package";
    }
    
    if (services.length === preMarriageClarity.length && 
        preMarriageClarity.every(s => services.includes(s))) {
      return "Pre-Marriage Clarity Package";
    }
    
    return null;
  };

  // Load Razorpay script
  useEffect(() => {
    const initRazorpay = async () => {
      try {
        // Check if already loaded
        if (isRazorpayAvailable()) {
          console.log("Razorpay already loaded in window object");
          setRazorpayLoaded(true);
          setInitializingPayment(false);
          return;
        }
        
        // Try to load it
        console.log("Attempting to load Razorpay script");
        const result = await loadRazorpayScript();
        setRazorpayLoaded(result);
        console.log("Razorpay script load result:", result);
      } catch (err) {
        console.error("Error initializing Razorpay:", err);
      } finally {
        setInitializingPayment(false);
      }
    };
    
    initRazorpay();
  }, []);

  useEffect(() => {
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === 'development');
    initializeBookingFromStorage(bookingState);
  }, []);

  // Get package name if applicable
  const packageName = getPackageName();

  if (submitted) {
    // Create a properly typed booking details object with all required properties
    const bookingDetails: BookingDetails = {
      clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
      email: personalDetails.email,
      services: selectedServices || [], 
      date: date, 
      timeSlot: timeSlot,
      timeframe: timeframe,
      serviceCategory: serviceCategory,
      packageName: packageName,
      amount: totalPrice
    };

    return (
      <>
        <GoogleAnalytics />
        <SEO 
          title="Consultation Confirmed"
          description="Your consultation with Peace2Hearts has been successfully booked. We look forward to supporting you on your relationship journey."
          keywords="book relationship counseling, legal consultation appointment, therapy session, mental health support"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <SuccessView 
              referenceId={referenceId}
              bookingDetails={bookingDetails}
            />
          </div>
        </main>
        <Footer />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <GoogleAnalytics />
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

          {initializingPayment && (
            <ConsultationAlert
              title="Loading Payment Gateway"
              description="Please wait while we initialize the payment system..."
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
