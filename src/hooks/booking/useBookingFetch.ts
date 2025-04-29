
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Booking, RawConsultation } from "./types";

export function useBookingFetch() {
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
        // Explicitly cast the data to our Booking type with proper handling of optional fields
        const typedBookings = data.map((booking: RawConsultation) => ({
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
          service_category: booking.service_category, // Handled as optional
          timeframe: booking.timeframe,               // Handled as optional
          time_slot: booking.time_slot || ""         // Provide default if somehow missing
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

  return {
    bookings,
    setBookings,
    loading,
    fetchBookings
  };
}
