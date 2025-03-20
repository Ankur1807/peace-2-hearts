import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  saveConsultation,
  PersonalDetails
} from '@/utils/consultationApi';

export function useConsultationBooking() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [serviceCategory, setServiceCategory] = useState('mental-health');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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
      // For combined bookings, we'll create multiple consultations
      if (selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      let lastResult;
      
      // Create a consultation for each selected service
      for (const service of selectedServices) {
        const result = await saveConsultation(
          service,
          date,
          timeSlot,
          personalDetails
        );
        
        if (result) {
          lastResult = result;
        }
      }
      
      if (lastResult) {
        setSubmitted(true);
        setReferenceId(lastResult.referenceId);
        window.scrollTo(0, 0);
        
        toast({
          title: "Booking Confirmed",
          description: `Your consultation${selectedServices.length > 1 ? 's have' : ' has'} been successfully booked.`,
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
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
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
