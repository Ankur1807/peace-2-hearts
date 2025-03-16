
import { supabase } from "@/integrations/supabase/client";

export interface BookingDetails {
  consultationType: string;
  date?: string;
  timeSlot: string;
  step: number;
  personalDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
}

export const checkAuthentication = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const storeBookingDetailsInLocalStorage = (details: BookingDetails) => {
  localStorage.setItem('bookingDetails', JSON.stringify(details));
};

export const getBookingDetailsFromLocalStorage = (): BookingDetails | null => {
  const details = localStorage.getItem('bookingDetails');
  return details ? JSON.parse(details) : null;
};

export const clearBookingDetailsFromLocalStorage = () => {
  localStorage.removeItem('bookingDetails');
};

export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlot: string,
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }
) => {
  if (!date) {
    throw new Error("Date is required");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd first get or create a consultant
  // For now, we'll use a mock consultant ID
  const consultantId = "mock-consultant-id";

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      user_id: userData.user.id,
      consultant_id: consultantId, // This would be a real consultant ID in production
      consultation_type: consultationType,
      date: date.toISOString(),
      time_slot: timeSlot,
      message: personalDetails.message
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving consultation:", error);
    throw error;
  }

  return data;
};

// Add consultation type display helper
export const getConsultationTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    'legal': 'Legal Consultation',
    'divorce': 'Divorce Consultation',
    'custody': 'Child Custody Consultation',
    'therapy': 'Therapy Session',
    'counseling': 'Personal Counseling',
    'couples': 'Couples Therapy',
    'family': 'Family Therapy',
    'premarital': 'Premarital Counseling',
    'mental-health': 'Mental Health Consultation'
  };
  
  return types[type] || 'Consultation';
};

// Add price helper
export const getConsultationPrice = (type: string): string => {
  const prices: Record<string, string> = {
    'legal': '₹2,500',
    'divorce': '₹3,000',
    'custody': '₹3,000',
    'therapy': '₹2,000',
    'counseling': '₹1,800',
    'couples': '₹2,500',
    'family': '₹2,800',
    'premarital': '₹2,000',
    'mental-health': '₹2,200'
  };
  
  return prices[type] || '₹2,000';
};

// Add time slot label formatter
export const getTimeSlotLabel = (timeSlot: string): string => {
  return timeSlot.replace('-', ' - ');
};

// Credit card formatting helper
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Expiry date formatting helper
export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  
  return v;
};
