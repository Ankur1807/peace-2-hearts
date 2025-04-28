
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
  personalDetails?: PersonalDetails; // Add this for bookingInitializer.ts
  selectedServices?: string[]; // Add this for bookingInitializer.ts
}

export interface VerificationResult {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
  amount?: number;
  referenceId?: string;
}
