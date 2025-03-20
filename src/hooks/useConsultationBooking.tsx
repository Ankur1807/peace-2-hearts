
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  storeBookingDetailsInLocalStorage,
  saveConsultation
} from '@/utils/consultationUtils';

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export function useConsultationBooking() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleNextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
    
    // Store current booking details in case user refreshes
    storeBookingDetailsInLocalStorage({
      consultationType,
      date: date?.toISOString(),
      timeSlot,
      step: step + 1,
      personalDetails
    });
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
      const result = await saveConsultation(
        consultationType,
        date,
        timeSlot,
        personalDetails
      );
      
      if (result) {
        setSubmitted(true);
        setReferenceId(result.referenceId);
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

  return {
    date,
    setDate,
    step,
    setStep,
    consultationType,
    setConsultationType,
    timeSlot,
    setTimeSlot,
    submitted,
    isProcessing,
    referenceId,
    personalDetails,
    handleNextStep,
    handlePrevStep,
    handlePersonalDetailsChange,
    handleProcessPayment,
    handleConfirmBooking
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
