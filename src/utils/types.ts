
export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  name?: string; // Legacy field, kept for backward compatibility
}

export interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: Date;
  timeSlot: string;
  timeframe?: string;
  message?: string;
  serviceCategory?: string;
  amount?: number;
  phone?: string;
  paymentId?: string;
  highPriority?: boolean;
  isResend?: boolean;
  packageName?: string;
  selectedServices?: string[];
  personalDetails?: PersonalDetails;
  isRecovery?: boolean;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
  referenceId?: string;
}

export interface SerializedBookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: string;
  timeSlot: string;
  timeframe?: string;
  message?: string;
  serviceCategory?: string;
  amount?: number;
  phone?: string;
  paymentId?: string;
  highPriority?: boolean;
  isResend?: boolean;
  packageName?: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
  isRecovery?: boolean;
}
