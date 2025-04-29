
import { useCallback } from 'react';
import { saveConsultation } from '@/utils/consultationApi';

interface UseConsultationActionsParams {
  state: any;
  setReferenceId: (id: string | null) => void;
  setSubmitted: (submitted: boolean) => void;
  setBookingError: (error: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  toast: any;
}

export const useConsultationActions = ({
  state,
  setReferenceId,
  setSubmitted,
  setBookingError,
  setIsProcessing,
  toast
}: UseConsultationActionsParams) => {
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    setBookingError(null);
    
    try {
      console.log("handleConfirmBooking started with state:", {
        selectedServices: state.selectedServices,
        serviceCategory: state.serviceCategory,
        date: state.date,
        timeSlot: state.timeSlot,
        timeframe: state.timeframe,
      });
      
      // Get the consultation type from the selected services
      const consultationType = state.selectedServices.length > 0 
        ? state.selectedServices[0] 
        : state.serviceCategory;
      
      // Determine if we're using a date/timeslot or a timeframe
      const timeSlotOrTimeframe = state.serviceCategory === 'holistic' 
        ? state.timeframe 
        : state.timeSlot;
      
      console.log("Saving consultation with:", {
        consultationType,
        timeSlotOrTimeframe,
        isHolistic: state.serviceCategory === 'holistic',
        personalDetails: state.personalDetails
      });
      
      // Save the consultation
      const result = await saveConsultation(
        consultationType,
        state.date,
        timeSlotOrTimeframe,
        state.personalDetails
      );
      
      console.log("Consultation saved successfully:", result);
      
      // Set the reference ID for later use
      if (result && result.referenceId) {
        setReferenceId(result.referenceId);
        console.log("Reference ID set to:", result.referenceId);
      } else {
        throw new Error("No reference ID returned from saveConsultation");
      }
      
      // If we don't need payment (e.g., for free consultations), set submitted to true
      if (state.totalPrice <= 0) {
        setSubmitted(true);
      }
      
      return result;
    } catch (error) {
      console.error("Error in handleConfirmBooking:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to book consultation";
      setBookingError(errorMessage);
      
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

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

    if (!selectedServices || selectedServices.length === 0) {
      throw new Error("No services selected");
    }

    for (const service of selectedServices) {
      console.log(`Creating consultation for service: ${service}`);
      try {
        const result = await saveConsultation(
          service,
          serviceCategory === 'holistic' ? undefined : date,
          serviceCategory === 'holistic' ? timeframe : timeSlot,
          personalDetails
        );
        
        if (result) {
          console.log(`Consultation created for ${service}:`, result);
          lastResult = result;
        } else {
          console.error(`Failed to create consultation for ${service}: No result returned`);
        }
      } catch (error) {
        console.error(`Error creating consultation for ${service}:`, error);
        throw error;
      }
    }
    
    if (!lastResult) {
      throw new Error("Failed to create any consultations");
    }
    
    return lastResult;
  }, [state]);
  
  return {
    handleConfirmBooking,
    processServiceBookings
  };
};
