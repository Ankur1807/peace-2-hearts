
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
