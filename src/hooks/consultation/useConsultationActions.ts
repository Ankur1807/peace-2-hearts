
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
      console.log("[BOOKING FLOW] handleConfirmBooking started with state:", {
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
      
      console.log("[BOOKING FLOW] Validating reference ID in handleConfirmBooking:", {
        consultationType,
        timeSlotOrTimeframe,
        isHolistic: state.serviceCategory === 'holistic',
        personalDetails: state.personalDetails
      });
      
      // Only check if reference ID is valid, don't save new consultation
      let result;
      if (state.referenceId) {
        // If we already have a referenceId, just return it
        console.log("[BOOKING FLOW] Using existing reference ID:", state.referenceId);
        result = { referenceId: state.referenceId };
      } else {
        // Generate a new reference ID
        try {
          result = await saveConsultation(
            consultationType,
            state.date,
            timeSlotOrTimeframe,
            state.personalDetails
          );
        } catch (error) {
          console.error("[BOOKING FLOW] Error validating reference ID:", error);
          throw new Error("Could not validate reference ID");
        }
      }
      
      console.log("[BOOKING FLOW] Reference ID validated:", result);
      
      // Set the reference ID for later use
      if (result && result.referenceId) {
        setReferenceId(result.referenceId);
        console.log("[BOOKING FLOW] Reference ID set to:", result.referenceId);
      } else {
        throw new Error("No reference ID returned from saveConsultation");
      }
      
      // If we don't need payment (e.g., for free consultations), set submitted to true
      if (state.totalPrice <= 0) {
        setSubmitted(true);
      }
      
      return result;
    } catch (error) {
      console.error("[BOOKING FLOW] Error in handleConfirmBooking:", error);
      
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
    
    console.log("[BOOKING FLOW] processServiceBookings - Starting bookings process with state:", {
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

    // Just validate referenceId for first service and use it for all others
    console.log(`[BOOKING FLOW] Validating reference ID for service: ${selectedServices[0]}`);
    try {
      const result = await saveConsultation(
        selectedServices[0],
        serviceCategory === 'holistic' ? undefined : date,
        serviceCategory === 'holistic' ? timeframe : timeSlot,
        personalDetails
      );
      
      if (result) {
        console.log(`[BOOKING FLOW] Reference ID validated for ${selectedServices[0]}:`, result);
        lastResult = result;
      } else {
        console.error(`[BOOKING FLOW] Failed to validate reference ID for ${selectedServices[0]}: No result returned`);
      }
    } catch (error) {
      console.error(`[BOOKING FLOW] Error validating reference ID for ${selectedServices[0]}:`, error);
      throw error;
    }
    
    if (!lastResult) {
      throw new Error("Failed to validate reference ID");
    }
    
    return lastResult;
  }, [state]);
  
  return {
    handleConfirmBooking,
    processServiceBookings
  };
};
