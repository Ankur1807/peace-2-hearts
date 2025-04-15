
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
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setBookings(data as Booking[]);
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
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

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

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    updateBookingStatus,
    fetchBookings
  };
}
