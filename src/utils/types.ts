
export interface BookingDetails {
  serviceCategory: string;
  selectedServices?: string[];
  services: string[]; // Changed from optional to required
  date?: string | Date;
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
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
