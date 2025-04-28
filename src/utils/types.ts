
export interface BookingDetails {
  serviceCategory: string;
  selectedServices?: string[];
  services: string[]; // Changed from optional to required
  date?: Date;  // Changed from string | Date to just Date
  timeSlot?: string;
  timeframe?: string;
  packageName?: string;
  amount?: number;
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
  clientName: string;
  email: string;
  referenceId: string; // Added missing referenceId property
  message?: string; // Added message property to match usage in templates
  consultationType?: string; // Added consultationType property to resolve the error
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

// Add the VerificationResult type
export interface VerificationResult {
  success: boolean;
  message: string;
}
