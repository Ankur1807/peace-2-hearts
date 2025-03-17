
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StepIndicator from '@/components/consultation/StepIndicator';
import ServiceSelectionStep from '@/components/consultation/ServiceSelectionStep';
import PersonalDetailsStep from '@/components/consultation/PersonalDetailsStep';
import PaymentStep from '@/components/consultation/PaymentStep';
import ConfirmationStep from '@/components/consultation/ConfirmationStep';
import SuccessView from '@/components/consultation/SuccessView';
import { SEO } from '@/components/SEO';
import { 
  checkAuthentication, 
  storeBookingDetailsInLocalStorage,
  getBookingDetailsFromLocalStorage,
  clearBookingDetailsFromLocalStorage,
  saveConsultation
} from '@/utils/consultationUtils';
import { supabase } from '@/integrations/supabase/client';

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const BookConsultation = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      
      // If not authenticated and at step 3 or higher, redirect to sign in
      if (!authenticated && step > 2) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue booking your consultation.",
        });
        // Store current booking details
        storeBookingDetailsInLocalStorage({
          consultationType,
          date: date?.toISOString(),
          timeSlot,
          step,
          personalDetails
        });
        navigate("/sign-in");
      }
    };
    
    checkAuth();
    
    // Check if there are stored booking details (e.g., from returning after sign-in)
    const storedDetails = getBookingDetailsFromLocalStorage();
    if (storedDetails) {
      setConsultationType(storedDetails.consultationType || '');
      setDate(storedDetails.date ? new Date(storedDetails.date) : undefined);
      setTimeSlot(storedDetails.timeSlot || '');
      setStep(storedDetails.step || 1);
      if (storedDetails.personalDetails) {
        setPersonalDetails(storedDetails.personalDetails);
      }
      // Clear the stored details after retrieving them
      clearBookingDetailsFromLocalStorage();
    }
  }, [step, navigate, consultationType, date, timeSlot, personalDetails, toast]);

  const steps = [
    { number: 1, label: "Service" },
    { number: 2, label: "Details" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" }
  ];

  const handleNextStep = () => {
    // If moving to payment step, ensure user is authenticated
    if (step === 2 && !isAuthenticated) {
      // Store current booking details
      storeBookingDetailsInLocalStorage({
        consultationType,
        date: date?.toISOString(),
        timeSlot,
        step: 3, // Set to next step so they come back here
        personalDetails
      });
      
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue booking your consultation.",
      });
      
      navigate("/sign-in");
      return;
    }
    
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    setPersonalDetails(details);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // First check if the user is authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Save details and redirect to sign in
        storeBookingDetailsInLocalStorage({
          consultationType,
          date: date?.toISOString(),
          timeSlot,
          step: 3,
          personalDetails
        });
        
        toast({
          title: "Authentication Required",
          description: "Please sign in to complete your booking.",
        });
        
        navigate("/sign-in");
        return;
      }
      
      // Mock payment processing
      // In a real application, this would integrate with a payment gateway
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        setStep(4);
        window.scrollTo(0, 0);
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // Save the consultation to Supabase
      const consultation = await saveConsultation(
        consultationType,
        date,
        timeSlot,
        personalDetails
      );
      
      if (consultation) {
        setSubmitted(true);
        window.scrollTo(0, 0);
        
        toast({
          title: "Booking Confirmed",
          description: "Your consultation has been successfully booked.",
        });
      }
    } catch (error: any) {
      console.error("Error confirming booking:", error);
      
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error confirming your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

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
            <SuccessView />
          </div>
        </main>
        <Footer />
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

          <StepIndicator currentStep={step} steps={steps} />

          <Card className="p-6 md:p-8">
            <form onSubmit={step === 3 ? handleProcessPayment : (e) => e.preventDefault()}>
              {step === 1 && (
                <ServiceSelectionStep 
                  consultationType={consultationType}
                  setConsultationType={setConsultationType}
                  onNextStep={handleNextStep}
                />
              )}
              
              {step === 2 && (
                <PersonalDetailsStep
                  date={date}
                  setDate={setDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  personalDetails={personalDetails}
                  onPersonalDetailsChange={handlePersonalDetailsChange}
                  onNextStep={handleNextStep}
                  onPrevStep={handlePrevStep}
                />
              )}

              {step === 3 && (
                <PaymentStep
                  consultationType={consultationType}
                  onNextStep={handleNextStep}
                  onPrevStep={handlePrevStep}
                  onSubmit={handleProcessPayment}
                  isProcessing={isProcessing}
                />
              )}
              
              {step === 4 && (
                <ConfirmationStep
                  consultationType={consultationType}
                  date={date}
                  timeSlot={timeSlot}
                  personalDetails={personalDetails}
                  onPrevStep={handlePrevStep}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookConsultation;
