import { supabase } from "@/integrations/supabase/client";

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

  try {
    // Try to find a consultant with the appropriate specialization
    const { data: consultants, error: consultantError } = await supabase
      .from('consultants')
      .select('id')
      .eq('specialization', consultationType)
      .eq('is_available', true)
      .limit(1);

    if (consultantError) {
      console.error("Error fetching consultants:", consultantError);
      throw consultantError;
    }

    // If no consultant is found, use any available consultant
    let consultantId;
    if (consultants && consultants.length > 0) {
      consultantId = consultants[0].id;
    } else {
      // Select any consultant
      const { data: anyConsultant, error: anyConsultantError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);
        
      if (anyConsultantError || !anyConsultant || anyConsultant.length === 0) {
        throw new Error("No consultants available. Please contact support.");
      }
      
      consultantId = anyConsultant[0].id;
    }

    // Create a reference ID for the consultation
    const referenceId = generateReferenceId();

    // Save the consultation without requiring user authentication
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .insert({
        consultant_id: consultantId,
        consultation_type: consultationType,
        date: date.toISOString(),
        time_slot: timeSlot,
        message: personalDetails.message,
        status: 'scheduled',
        user_id: 'guest', // Using a placeholder value for non-authenticated users
        reference_id: referenceId,
        client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
        client_email: personalDetails.email,
        client_phone: personalDetails.phone
      })
      .select()
      .single();

    if (consultationError) {
      console.error("Error saving consultation:", consultationError);
      throw consultationError;
    }

    return { ...consultation, referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};

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
    'mental-health': 'Mental Health Consultation',
    'mental-health-counselling': 'Mental Health Counselling',
    'family-therapy': 'Family Therapy',
    'premarital-counselling': 'Premarital Counselling',
    'couples-counselling': 'Couples Counselling',
    'sexual-health-counselling': 'Sexual Health Counselling',
    'pre-marriage-legal': 'Pre-marriage Legal Consultation',
    'mediation': 'Mediation Services',
    'maintenance': 'Maintenance Consultation',
    'general-legal': 'General Legal Consultation'
  };
  
  return types[type] || 'Consultation';
};

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
    'mental-health': '₹2,200',
    'mental-health-counselling': '₹2,200',
    'family-therapy': '₹2,800',
    'premarital-counselling': '₹2,000',
    'couples-counselling': '₹2,500',
    'sexual-health-counselling': '₹2,200',
    'pre-marriage-legal': '₹2,500',
    'mediation': '₹2,800',
    'maintenance': '₹3,000',
    'general-legal': '₹2,500'
  };
  
  return prices[type] || '₹2,000';
};

export const getTimeSlotLabel = (timeSlot: string): string => {
  const timeSlotMap: Record<string, string> = {
    '9-am': '9:00 AM',
    '10-am': '10:00 AM',
    '11-am': '11:00 AM',
    '1-pm': '1:00 PM',
    '2-pm': '2:00 PM',
    '3-pm': '3:00 PM',
    '4-pm': '4:00 PM'
  };
  
  return timeSlotMap[timeSlot] || timeSlot.replace('-', ' - ');
};

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

export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  
  return v;
};

const generateReferenceId = (): string => {
  const prefix = 'P2H';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};
