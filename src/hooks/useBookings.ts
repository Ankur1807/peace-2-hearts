
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  consultation_type: string;
  date: string;
  status: string;
  reference_id: string;
  created_at: string;
  payment_id?: string;
  payment_status?: string;
  email_sent: boolean;
  service_category?: string;
  timeframe?: string;
  time_slot?: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Fetching bookings from Supabase...");
      
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      if (data) {
        console.log(`Fetched ${data.length} bookings:`, data);
        // Explicitly cast the data to our Booking type
        const typedBookings = data.map(booking => ({
          id: booking.id,
          client_name: booking.client_name || "",
          client_email: booking.client_email || "",
          client_phone: booking.client_phone || "",
          consultation_type: booking.consultation_type,
          date: booking.date || "",
          status: booking.status,
          reference_id: booking.reference_id || "",
          created_at: booking.created_at,
          payment_id: booking.payment_id,
          payment_status: booking.payment_status,
          email_sent: booking.email_sent || false,
          service_category: booking.service_category,
          timeframe: booking.timeframe,
          time_slot: booking.time_slot
        })) as Booking[];
        
        setBookings(typedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load booking history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error("Error updating booking status:", error);
        throw error;
      }

      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      toast({
        title: "Status Updated",
        description: "Booking status has been successfully updated",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };
  
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
          timeSlot: booking.time_slot,
          timeframe: booking.timeframe,
          serviceCategory: booking.service_category || 'general',
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
      
      // Refresh the booking list
      fetchBookings();
      
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

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    updateBookingStatus,
    fetchBookings,
    resendConfirmationEmail
  };
}
