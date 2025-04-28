
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
  date?: Date;
  timeSlot?: string;
  timeframe?: string;
  packageName?: string | null;
  serviceCategory: string;
  amount?: number;
  message?: string;
  phone?: string;
  personalDetails?: PersonalDetails; // For bookingInitializer.ts
  selectedServices?: string[]; // For bookingInitializer.ts
  isResend?: boolean; // Flag for resent emails
  isRecovery?: boolean; // Flag for recovery emails
  highPriority?: boolean; // For prioritizing important emails
}

export interface VerificationResult {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
  amount?: number;
  referenceId?: string;
}
