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

    // If no consultant is found, we'll use a default system consultant ID
    // This avoids RLS issues with creating consultants on the fly
    let consultantId;
    if (consultants && consultants.length > 0) {
      consultantId = consultants[0].id;
    } else {
      // Get or create a default consultant using an edge function or API endpoint
      // For now, we'll use a temporary approach - selecting any consultant
      const { data: anyConsultant, error: anyConsultantError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);
        
      if (anyConsultantError || !anyConsultant || anyConsultant.length === 0) {
        throw new Error("No consultants available. Please contact support.");
      }
      
      consultantId = anyConsultant[0].id;
    }

    // Save the consultation
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .insert({
        user_id: userData.user.id,
        consultant_id: consultantId,
        consultation_type: consultationType,
        date: date.toISOString(),
        time_slot: timeSlot,
        message: personalDetails.message,
        status: 'scheduled'
      })
      .select()
      .single();

    if (consultationError) {
      console.error("Error saving consultation:", consultationError);
      throw consultationError;
    }

    // Update user profile with name and phone if not already set
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (!profileError && profile) {
      // Only update if needed
      if (!profile.full_name || !profile.phone_number) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name || `${personalDetails.firstName} ${personalDetails.lastName}`,
            phone_number: profile.phone_number || personalDetails.phone
          })
          .eq('id', userData.user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          // Non-critical error, we can continue
        }
      }
    }

    return consultation;
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};

export const fetchUserConsultations = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('consultations')
    .select(`
      id,
      consultation_type,
      date,
      time_slot,
      status,
      message,
      consultant_id,
      consultants (
        specialization,
        hourly_rate,
        profile_id,
        profiles (
          full_name
        )
      )
    `)
    .eq('user_id', userData.user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching consultations:", error);
    throw error;
  }

  return data.map(consultation => ({
    id: consultation.id,
    date: new Date(consultation.date),
    service: getConsultationTypeLabel(consultation.consultation_type),
    specialist: consultation.consultants?.profiles?.full_name || "Specialist",
    status: mapStatusToUI(consultation.status)
  }));
};

const mapStatusToUI = (status: string): "upcoming" | "completed" | "cancelled" => {
  if (status === 'scheduled' || status === 'confirmed') return 'upcoming';
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  return 'upcoming'; // Default case
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
    'mental-health': 'Mental Health Consultation'
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
    'mental-health': '₹2,200'
  };
  
  return prices[type] || '₹2,000';
};

export const getTimeSlotLabel = (timeSlot: string): string => {
  return timeSlot.replace('-', ' - ');
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
