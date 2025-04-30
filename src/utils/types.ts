
export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType?: string;
  services?: string[];
  date?: Date | string;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  amount?: number;
  isResend?: boolean;
  phone?: string;
  serviceCategory?: string;
  packageName?: string;
  highPriority?: boolean;
  bcc?: string;
  // New fields to match actual usage
  selectedServices?: string[];
  personalDetails?: PersonalDetails;
  isRecovery?: boolean;
}

export interface Consultant {
  id: string;
  created_at?: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  service_category: string[];
  available_days: string[];
  available_times: string[];
  price: number;
  featured: boolean;
  years_of_experience: number;
  specialties: string[];
}

export interface Service {
  id: string;
  created_at?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  featured: boolean;
  popular: boolean;
}

// Updated interface with redirectUrl and message fields
export interface VerificationResult {
  success: boolean;
  verified: boolean;
  error?: string;
  redirectUrl?: string;
  message?: string; // Added the missing message property
  details?: any;
}

export interface SerializedBookingDetails extends BookingDetails {
  formattedDate?: string;
  formattedTime?: string;
}
