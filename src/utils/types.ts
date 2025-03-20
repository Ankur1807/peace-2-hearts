
export interface BookingDetails {
  serviceCategory: string;
  selectedServices: string[];
  date?: string;
  timeSlot: string;
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
