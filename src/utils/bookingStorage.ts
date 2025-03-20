
import { BookingDetails } from "./types";

export const storeBookingDetailsInLocalStorage = (details: BookingDetails) => {
  localStorage.setItem('bookingDetails', JSON.stringify(details));
};

export const getBookingDetailsFromLocalStorage = (): BookingDetails | null => {
  const details = localStorage.getItem('bookingDetails');
  return details ? JSON.parse(details) : null;
};

export const clearBookingDetailsFromLocalStorage = () => {
  localStorage.removeItem('bookingDetails');
};
