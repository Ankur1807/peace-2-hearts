export interface VerificationResult {
  success: boolean;
  message: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: string | Date;  // Allow both string and Date
  timeSlot?: string;
  timeframe?: string;
  packageName?: string | null;
  serviceCategory: string;
  amount?: number;
  message?: string;
  phone?: string;
  personalDetails?: PersonalDetails;
  selectedServices?: string[];
  isResend?: boolean;
  isRecovery?: boolean;
  highPriority?: boolean;
}

export interface SerializedBookingDetails extends Omit<BookingDetails, 'date'> {
  date?: string;
  formattedDate?: string;
}

export interface PaymentRecord {
  id: string;
  consultation_id: string;
  amount: number;
  transaction_id?: string;
  payment_status: string;
  payment_method?: string;
  email_sent?: boolean;
  recovery_timestamp?: string;
  created_at?: string;
  updated_at?: string;
  currency?: string;
}

export interface SavePaymentRecordParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
  bookingDetails?: BookingDetails;
  highPriority?: boolean;
}
