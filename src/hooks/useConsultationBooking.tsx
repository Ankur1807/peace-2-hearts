
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveConsultation } from '@/utils/consultationApi';
import { PersonalDetails } from '@/utils/types';
import { supabase } from "@/integrations/supabase/client";

export function useConsultationBooking() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [serviceCategory, setServiceCategory] = useState('holistic');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [timeframe, setTimeframe] = useState('1-2-weeks');
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

  const sendBookingConfirmationEmail = async (bookingDetails: any) => {
    try {
      console.log("Sending booking confirmation email:", bookingDetails);
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: bookingDetails
      });

      if (error) {
        console.error("Error sending booking confirmation:", error);
        throw new Error(`Failed to send confirmation email: ${error.message || 'Unknown error'}`);
      }

      console.log("Confirmation email sent:", data);
      return data;
    } catch (error: any) {
      console.error("Exception in sendBookingConfirmationEmail:", error);
      // Don't throw here - we don't want to break the booking flow if email fails
      toast({
        title: "Email Notification",
        description: "Your booking was successful, but there was an issue sending the confirmation email. Please check your spam folder or contact support.",
        variant: "destructive"
      });
    }
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
      console.log("Using timeframe:", timeframe);
      console.log("Using personal details:", personalDetails);

      let lastResult;
      
      // Create a consultation for each selected service
      for (const service of selectedServices) {
        console.log(`Creating consultation for service: ${service}`);
        const result = await saveConsultation(
          service,
          serviceCategory === 'holistic' ? undefined : date,
          serviceCategory === 'holistic' ? timeframe : timeSlot,
          personalDetails
        );
        
        if (result) {
          console.log(`Consultation created for ${service}:`, result);
          lastResult = result;
        }
      }
      
      if (lastResult) {
        console.log("All consultations created successfully. Last result:", lastResult);
        setReferenceId(lastResult.referenceId);

        // Send confirmation email with booking details
        const bookingDetails = {
          referenceId: lastResult.referenceId,
          clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
          email: personalDetails.email,
          phone: personalDetails.phone,
          consultationType: selectedServices.length > 1 ? 'multiple' : selectedServices[0],
          services: selectedServices,
          date: serviceCategory === 'holistic' ? undefined : date,
          timeSlot: serviceCategory === 'holistic' ? undefined : timeSlot,
          timeframe: serviceCategory === 'holistic' ? timeframe : undefined,
          message: personalDetails.message
        };

        // Send confirmation email
        await sendBookingConfirmationEmail(bookingDetails);
        
        setSubmitted(true);
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
    timeframe,
    setTimeframe,
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
