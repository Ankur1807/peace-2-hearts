
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveConsultation } from '@/utils/consultationApi';
import { PersonalDetails } from '@/utils/types';
import { supabase } from "@/integrations/supabase/client";

// Types
interface BookingState {
  date: Date | undefined;
  serviceCategory: string;
  selectedServices: string[];
  timeSlot: string;
  timeframe: string;
  submitted: boolean;
  isProcessing: boolean;
  referenceId: string | null;
  bookingError: string | null;
  personalDetails: PersonalDetails;
}

// Hook for managing consultation booking state
export function useConsultationBooking() {
  const [state, setState] = useState<BookingState>({
    date: undefined,
    serviceCategory: 'holistic',
    selectedServices: [],
    timeSlot: '',
    timeframe: '1-2-weeks',
    submitted: false,
    isProcessing: false,
    referenceId: null,
    bookingError: null,
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    }
  });
  
  const { toast } = useToast();

  // State setter functions
  const setDate = (date: Date | undefined) => setState(prev => ({ ...prev, date }));
  const setServiceCategory = (serviceCategory: string) => setState(prev => ({ ...prev, serviceCategory }));
  const setSelectedServices = (selectedServices: string[]) => setState(prev => ({ ...prev, selectedServices }));
  const setTimeSlot = (timeSlot: string) => setState(prev => ({ ...prev, timeSlot }));
  const setTimeframe = (timeframe: string) => setState(prev => ({ ...prev, timeframe }));
  const setSubmitted = (submitted: boolean) => setState(prev => ({ ...prev, submitted }));
  const setIsProcessing = (isProcessing: boolean) => setState(prev => ({ ...prev, isProcessing }));
  const setReferenceId = (referenceId: string | null) => setState(prev => ({ ...prev, referenceId }));
  const setBookingError = (bookingError: string | null) => setState(prev => ({ ...prev, bookingError }));

  // Handle personal details updates
  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setState(prev => ({ ...prev, personalDetails: details }));
  };

  // Send booking confirmation email
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

  // Create booking details for email
  const prepareBookingDetails = (lastResult: any) => {
    const { personalDetails, selectedServices, serviceCategory, date, timeSlot, timeframe } = state;
    
    return {
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
  };

  // Process each service booking
  const processServiceBookings = async () => {
    const { selectedServices, serviceCategory, date, timeSlot, timeframe, personalDetails } = state;
    let lastResult;
    
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
    
    return lastResult;
  };
  
  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    console.log("handleConfirmBooking called with services:", state.selectedServices);
    setIsProcessing(true);
    setBookingError(null);
    
    try {
      if (state.selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      console.log("Starting booking process with state:", {
        services: state.selectedServices,
        date: state.date,
        timeSlot: state.timeSlot,
        timeframe: state.timeframe,
        personalDetails: state.personalDetails
      });

      // Process all service bookings
      const lastResult = await processServiceBookings();
      
      if (lastResult) {
        console.log("All consultations created successfully. Last result:", lastResult);
        setReferenceId(lastResult.referenceId);

        // Prepare and send booking confirmation email
        const bookingDetails = prepareBookingDetails(lastResult);
        await sendBookingConfirmationEmail(bookingDetails);
        
        setSubmitted(true);
        window.scrollTo(0, 0);
        
        toast({
          title: "Booking Confirmed",
          description: `Your consultation${state.selectedServices.length > 1 ? 's have' : ' has'} been successfully booked.`,
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

  // Return all state and functions
  return {
    ...state,
    setDate,
    setServiceCategory,
    setSelectedServices,
    setTimeSlot,
    setTimeframe,
    handlePersonalDetailsChange,
    handleConfirmBooking
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
