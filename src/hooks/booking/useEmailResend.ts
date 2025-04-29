import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/email";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";

// Define a proper type
interface ConsultationBooking {
  id: string;
  client_name?: string;
  client_email?: string;
  reference_id?: string;
  consultation_type?: string;
  service_category?: string;
  date?: string;
  time_slot?: string;
  timeframe?: string;
  message?: string;
}

export function useEmailResend() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const resendConfirmationEmail = async (bookingId: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting to resend confirmation email for booking ${bookingId}`);
      
      // Fetch booking
      const { data: booking, error: fetchError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', bookingId)
        .single<ConsultationBooking>();
      
      if (fetchError) {
        console.error("Error fetching booking for email resend:", fetchError);
        throw new Error(fetchError.message);
      }
      
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      if (!booking.reference_id) {
        throw new Error("Booking missing reference ID");
      }
      
      if (!booking.client_email) {
        throw new Error("Booking missing client email address");
      }

      const serviceCategory = booking.service_category || determineServiceCategory(booking.consultation_type || '');
      
      const bookingDetails = {
        clientName: booking.client_name || '',
        email: booking.client_email,
        referenceId: booking.reference_id,
        consultationType: booking.consultation_type || '',
        services: booking.consultation_type ? [booking.consultation_type] : [],
        date: booking.date ? new Date(booking.date) : undefined,
        timeSlot: booking.time_slot || '',
        timeframe: booking.timeframe || '',
        message: booking.message || '',
        serviceCategory,
        highPriority: true,
        isResend: true
      };
      
      const emailResult = await sendBookingConfirmationEmail(bookingDetails);
      
      if (emailResult) {
        toast({
          title: "Email Sent",
          description: "Confirmation email has been resent successfully.",
        });
        return true;
      } else {
        throw new Error("Failed to send confirmation email");
      }
    } catch (error: any) {
      console.error("Error resending confirmation email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { resendConfirmationEmail, isLoading };
}
