
/**
 * Hook for resending confirmation emails for bookings
 */
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/email";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";

export function useEmailResend() {
  const { toast } = useToast();
  
  const resendConfirmationEmail = async (bookingId: string) => {
    try {
      console.log(`Attempting to resend confirmation email for booking ${bookingId}`);
      
      // First, get the booking details
      const { data: booking, error: fetchError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', bookingId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching booking for email resend:", fetchError);
        throw fetchError;
      }
      
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      console.log("Booking details for email resend:", booking);
      
      if (!booking.reference_id) {
        throw new Error("Booking has no reference ID");
      }
      
      // Determine service category from consultation type if not provided
      const serviceCategory = booking.service_category || 
                             determineServiceCategory(booking.consultation_type || '');
      
      // Get complete booking details
      const bookingDetails = {
        clientName: booking.client_name || '',
        email: booking.client_email || '',
        referenceId: booking.reference_id || '',
        consultationType: booking.consultation_type || '',
        services: booking.consultation_type ? [booking.consultation_type] : [],
        date: booking.date ? new Date(booking.date) : undefined,
        timeSlot: booking.time_slot || '',
        timeframe: booking.timeframe || '',
        message: booking.message || '',
        serviceCategory: serviceCategory,
        highPriority: true,
        isResend: true
      };
      
      // Try sending the email
      const emailResult = await sendBookingConfirmationEmail(bookingDetails);
      
      if (emailResult) {
        toast({
          title: "Email Sent",
          description: "Confirmation email has been resent successfully",
        });
        return true;
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email",
        variant: "destructive",
      });
      return false;
    }
  };

  return { resendConfirmationEmail };
}
