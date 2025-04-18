
import { useEffect, useState } from 'react';
import { useConsultationBooking } from '@/hooks/useConsultationBooking';
import { initializeBookingFromStorage } from '@/utils/bookingInitializer';
import ConsultationAlert from './ConsultationAlert';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';

interface ConsultationInitializerProps {
  serviceParam: string | null;
  subServiceParam: string | null;
  bookingState: ReturnType<typeof useConsultationBooking>;
}

const ConsultationInitializer: React.FC<ConsultationInitializerProps> = ({
  serviceParam,
  subServiceParam,
  bookingState
}) => {
  const { setServiceCategory, setSelectedServices } = bookingState;
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize Razorpay payment gateway
  useEffect(() => {
    const initRazorpay = async () => {
      try {
        if (isRazorpayAvailable()) {
          console.log("Razorpay already loaded in window object");
          setRazorpayLoaded(true);
          setInitializingPayment(false);
          return;
        }
        
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

  // Initialize booking state from URL parameters and storage
  useEffect(() => {
    if (initialized) return; // Only run once on initial load
    
    initializeBookingFromStorage(bookingState);
    
    // Pre-select service category from URL if provided
    if (serviceParam) {
      console.log("Pre-selecting service category:", serviceParam);
      setServiceCategory(serviceParam);
      
      // If subService is specified, pre-select it
      if (subServiceParam) {
        console.log("Pre-selecting sub-service:", subServiceParam);
        setSelectedServices([subServiceParam]);
        
        // Log to confirm the selection was made
        console.log("Selected services after pre-selection:", [subServiceParam]);
      }
    }
    
    setInitialized(true);
  }, [serviceParam, subServiceParam, setServiceCategory, setSelectedServices, initialized, bookingState]);

  // Ensure service selection persists
  useEffect(() => {
    if (initialized && subServiceParam && (!bookingState.selectedServices || bookingState.selectedServices.length === 0)) {
      console.log("Re-selecting sub-service because selection was lost:", subServiceParam);
      setSelectedServices([subServiceParam]);
    }
  }, [subServiceParam, bookingState.selectedServices, setSelectedServices, initialized]);

  return (
    <>
      {initializingPayment && (
        <ConsultationAlert
          title="Loading Payment Gateway"
          description="Please wait while we initialize the payment system..."
          variant="default"
          className="mb-6"
        />
      )}

      {bookingState.bookingError && (
        <ConsultationAlert
          title="Booking Error"
          description={bookingState.bookingError}
          variant="destructive"
          className="mb-6"
        />
      )}
    </>
  );
};

export default ConsultationInitializer;
