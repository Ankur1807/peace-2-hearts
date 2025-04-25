
import { useCallback } from 'react';
import { saveConsultation } from '@/utils/consultationApi';
import { sendBookingConfirmationEmail } from '@/utils/emailService';
import { getPackageName } from './consultationHelpers';

interface UseConsultationActionsProps {
  state: any; // Using any for simplicity, but in a real app, define a proper type
  setReferenceId: (id: string | null) => void;
  setSubmitted: (submitted: boolean) => void;
  setBookingError: (error: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  toast: any;
}

export function useConsultationActions({
  state,
  setReferenceId,
  setSubmitted,
  setBookingError,
  setIsProcessing,
  toast
}: UseConsultationActionsProps) {
  // Process each service booking
  const processServiceBookings = useCallback(async () => {
    const { selectedServices, serviceCategory, date, timeSlot, timeframe, personalDetails } = state;
    let lastResult;
    
    console.log("processServiceBookings - Starting bookings process with state:", {
      selectedServices, 
      serviceCategory, 
      date: date ? date.toString() : undefined, 
      timeSlot, 
      timeframe, 
      personalDetails
    });

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
        date: state.date ? state.date.toString() : undefined,
        timeSlot: state.timeSlot,
        timeframe: state.timeframe,
        personalDetails: state.personalDetails,
        totalPrice: state.totalPrice
      });

      // Process all service bookings
      const lastResult = await processServiceBookings();
      
      if (lastResult) {
        console.log("All consultations created successfully. Last result:", lastResult);
        setReferenceId(lastResult.referenceId);
        
        // Get package name if applicable
        const packageName = state.serviceCategory === 'holistic' 
          ? getPackageName(state.selectedServices) 
          : null;
        
        // Send confirmation email
        try {
          // Log the date for debugging
          console.log("Booking date before sending email:", state.date);
          if (state.date) {
            console.log("Date type:", typeof state.date);
            console.log("Is Date instance:", state.date instanceof Date);
            console.log("Date string representation:", state.date.toString());
            console.log("Date ISO string:", state.date.toISOString());
          }
          
          // Create email details object
          const emailDetails = {
            clientName: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
            email: state.personalDetails.email,
            referenceId: lastResult.referenceId,
            consultationType: state.selectedServices.length > 1 ? 'multiple' : state.selectedServices[0],
            services: state.selectedServices,
            // Only send date and timeSlot for non-holistic bookings
            date: state.serviceCategory === 'holistic' ? undefined : state.date,
            timeSlot: state.serviceCategory === 'holistic' ? undefined : state.timeSlot,
            // Only send timeframe for holistic bookings
            timeframe: state.serviceCategory === 'holistic' ? state.timeframe : undefined,
            message: state.personalDetails.message,
            // Include package name if applicable
            packageName: packageName,
            // Add service category
            serviceCategory: state.serviceCategory
          };
          
          console.log("Sending email with details:", JSON.stringify(emailDetails, null, 2));
          
          const emailSent = await sendBookingConfirmationEmail(emailDetails);
          console.log("Confirmation email sent successfully:", emailSent);
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
  }, [state, processServiceBookings, toast, setIsProcessing, setBookingError, setReferenceId, setSubmitted]);

  return {
    processServiceBookings,
    handleConfirmBooking
  };
}
