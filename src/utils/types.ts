
export interface BookingDetails {
  serviceCategory: string;
  selectedServices: string[];
  date?: string;
  timeSlot: string;
  timeframe?: string;
  packageName?: string;
  amount?: number;  // Keep this property - it's needed
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
  clientName?: string;
  email?: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
