
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      
      // Handle optional fields safely
      const bookingWithSafeProps = {
        ...booking,
        service_category: booking.service_category || 'general',
        time_slot: booking.time_slot || '',
        timeframe: booking.timeframe || ''
      };
      
      // Call the send-email edge function
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking-confirmation',
          clientName: booking.client_name,
          email: booking.client_email,
          referenceId: booking.reference_id,
          consultationType: booking.consultation_type,
          services: [booking.consultation_type],
          date: booking.date,
          timeSlot: bookingWithSafeProps.time_slot,
          timeframe: bookingWithSafeProps.timeframe,
          serviceCategory: bookingWithSafeProps.service_category,
          highPriority: true,
          isResend: true
        }
      });
      
      if (emailError) {
        console.error("Error from send-email function:", emailError);
        throw emailError;
      }
      
      console.log("Email resend response:", emailResponse);
      
      // Update the email_sent status
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ email_sent: true })
        .eq('id', bookingId);
        
      if (updateError) {
        console.error("Error updating email_sent status:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Email Sent",
        description: "Confirmation email has been resent successfully",
      });
      
      return true;
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
