
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveConsultation } from '@/utils/consultationApi';
import { PersonalDetails } from '@/utils/types';

export function useConsultationBooking() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [serviceCategory, setServiceCategory] = useState('holistic');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setPersonalDetails(details);
  };

  const handleConfirmBooking = async () => {
    console.log("handleConfirmBooking called with services:", selectedServices);
    setIsProcessing(true);
    setBookingError(null);
    
    try {
      // For combined bookings, we'll create multiple consultations
      if (selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      console.log("Starting booking process for services:", selectedServices);
      console.log("Using date:", date);
      console.log("Using time slot:", timeSlot);
      console.log("Using personal details:", personalDetails);

      let lastResult;
      
      // Create a consultation for each selected service
      for (const service of selectedServices) {
        console.log(`Creating consultation for service: ${service}`);
        const result = await saveConsultation(
          service,
          date,
          timeSlot,
          personalDetails
        );
        
        if (result) {
          console.log(`Consultation created for ${service}:`, result);
          lastResult = result;
        }
      }
      
      if (lastResult) {
        console.log("All consultations created successfully. Last result:", lastResult);
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
      setBookingError(error.message || "Unknown error occurred");
      
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
    bookingError,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
