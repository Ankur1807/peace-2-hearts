
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
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

  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    setPersonalDetails(details);
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    date,
    setDate,
    consultationType,
    setConsultationType,
    timeSlot,
    setTimeSlot,
    submitted,
    isProcessing,
    referenceId,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
