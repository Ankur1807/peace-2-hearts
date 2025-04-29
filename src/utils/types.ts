
// If this file doesn't exist yet, create it with the BookingDetails interface

export interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services?: string[];
  date?: Date | string;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  serviceCategory?: string | null;
  amount?: number;
  highPriority?: boolean;
  isResend?: boolean;
  isRecovery?: boolean;
}

// Add other interfaces as needed for serialized data
export interface SerializedBookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services?: string[];
  date?: string;
  formattedDate?: string;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  serviceCategory?: string | null;
  amount?: number;
  highPriority?: boolean;
  isResend?: boolean;
  isRecovery?: boolean;
}
