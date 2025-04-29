
// Define a type for raw consultation data from Supabase
export interface RawConsultation {
  id: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  consultation_type: string;
  date: string | null;
  status: string;
  reference_id: string | null;
  created_at: string;
  payment_id?: string | null;
  payment_status?: string | null;
  email_sent: boolean | null;
  service_category?: string | null;
  timeframe?: string | null;
  time_slot: string;
  message?: string | null;
}

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
  service_category?: string | null;
  timeframe?: string;
  time_slot: string;
  message?: string;
}

export interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  updateBookingStatus: (bookingId: string, newStatus: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  resendConfirmationEmail: (bookingId: string) => Promise<boolean>;
}
