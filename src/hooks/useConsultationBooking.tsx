import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveConsultation } from '@/utils/consultationApi';
import { PersonalDetails } from '@/utils/types';
import { sendBookingConfirmationEmail } from '@/utils/emailService';

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
  bookingDetails: {
    clientName: string;
    email: string;
    consultationType: string;
    services: string[];
    date?: Date;
    timeSlot?: string;
    timeframe?: string;
    message?: string;
  } | null;
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
    },
    bookingDetails: null
  });
  
  const { toast } = useToast();

  // State setter functions using useCallback to prevent unnecessary rerenders
  const setDate = useCallback((date: Date | undefined) => 
    setState(prev => ({ ...prev, date })), []);
  
  const setServiceCategory = useCallback((serviceCategory: string) => 
    setState(prev => ({ ...prev, serviceCategory })), []);
  
  const setSelectedServices = useCallback((services: string[] | ((prev: string[]) => string[])) => {
    setState(prev => {
      const updatedServices = typeof services === 'function' 
        ? services(prev.selectedServices) 
        : services;
      
      console.log("Updating selected services:", updatedServices);
      return { ...prev, selectedServices: updatedServices };
    });
  }, []);
  
  const setTimeSlot = useCallback((timeSlot: string) => 
    setState(prev => ({ ...prev, timeSlot })), []);
  
  const setTimeframe = useCallback((timeframe: string) => 
    setState(prev => ({ ...prev, timeframe })), []);
  
  const setSubmitted = useCallback((submitted: boolean) => 
    setState(prev => ({ ...prev, submitted })), []);
  
  const setIsProcessing = useCallback((isProcessing: boolean) => 
    setState(prev => ({ ...prev, isProcessing })), []);
  
  const setReferenceId = useCallback((referenceId: string | null) => 
    setState(prev => ({ ...prev, referenceId })), []);
  
  const setBookingError = useCallback((bookingError: string | null) => 
    setState(prev => ({ ...prev, bookingError })), []);

  // Handle personal details updates
  const handlePersonalDetailsChange = useCallback((details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setState(prev => ({ ...prev, personalDetails: details }));
  }, []);

  // Create booking details for email
  const prepareBookingDetails = useCallback((lastResult: any) => {
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
  }, [state]);

  // Process each service booking
  const processServiceBookings = useCallback(async () => {
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
  }, [state]);
  
  // Handle booking confirmation
  const handleConfirmBooking = useCallback(async () => {
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

        // Create booking details for email
        const bookingDetails = prepareBookingDetails(lastResult);
        console.log("Booking details created:", bookingDetails);
        
        // Store booking details for potential resend
        setState(prev => ({
          ...prev,
          bookingDetails: {
            clientName: bookingDetails.clientName,
            email: bookingDetails.email,
            consultationType: bookingDetails.consultationType,
            services: state.selectedServices,
            date: state.date,
            timeSlot: state.timeSlot,
            timeframe: state.timeframe,
            message: state.personalDetails.message
          }
        }));
        
        // Send confirmation email
        try {
          await sendBookingConfirmationEmail({
            clientName: bookingDetails.clientName,
            email: bookingDetails.email,
            referenceId: bookingDetails.referenceId,
            consultationType: bookingDetails.consultationType,
            services: state.selectedServices,
            date: state.date,
            timeSlot: state.timeSlot,
            timeframe: state.timeframe,
            message: state.personalDetails.message
          });
          console.log("Confirmation email sent successfully");
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Continue with the booking process even if email fails
        }
        
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
  }, [state, processServiceBookings, prepareBookingDetails, toast, setIsProcessing, setBookingError, setReferenceId, setSubmitted]);

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
