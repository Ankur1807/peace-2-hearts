
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "./types";

export function useBookingStatus(bookings: Booking[], setBookings: React.Dispatch<React.SetStateAction<Booking[]>>) {
  const { toast } = useToast();

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

  return { updateBookingStatus };
}
