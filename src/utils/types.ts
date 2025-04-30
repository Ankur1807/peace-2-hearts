
export interface PersonalDetails {
  name?: string;
  email: string;
  phone: string;
  message: string;
  firstName: string;
  lastName: string;
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
}
