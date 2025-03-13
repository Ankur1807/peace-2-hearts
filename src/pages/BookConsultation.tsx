
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
import { 
  checkAuthentication, 
  storeBookingDetailsInLocalStorage,
  getBookingDetailsFromLocalStorage,
  clearBookingDetailsFromLocalStorage
} from '@/utils/consultationUtils';

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
  }, []);

  const steps = [
    { number: 1, label: "Service" },
    { number: 2, label: "Details" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" }
  ];

  const handleNextStep = () => {
    // Store current progress in case user needs to sign in later
    storeBookingDetailsInLocalStorage({
      consultationType,
      date: date?.toISOString(),
      timeSlot,
      step: step + 1,
      personalDetails
    });
    
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

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      setStep(4);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleConfirmBooking = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <>
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
