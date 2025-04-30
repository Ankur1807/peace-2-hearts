export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services?: string[];
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
}
