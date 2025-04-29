
import { useEffect } from "react";
import { useBookingFetch } from "./booking/useBookingFetch";
import { useBookingStatus } from "./booking/useBookingStatus";
import { useEmailResend } from "./booking/useEmailResend";
import { UseBookingsReturn } from "./booking/types";

export { Booking } from "./booking/types";

export function useBookings(): UseBookingsReturn {
  const { bookings, setBookings, loading, fetchBookings } = useBookingFetch();
  const { updateBookingStatus } = useBookingStatus(bookings, setBookings);
  const { resendConfirmationEmail } = useEmailResend();

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
