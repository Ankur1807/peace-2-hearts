
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const formatCardNumber = (value: string) => {
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

export const formatExpiryDate = (value: string) => {
  let formatted = value.replace(/[^\d]/g, '');
  
  if (formatted.length > 2) {
    formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
  }
  
  return formatted;
};

export const getConsultationTypeLabel = (type: string) => {
  switch(type) {
    // Mental Health Services
    case 'mental-health-counselling': return 'Mental Health Counselling';
    case 'family-therapy': return 'Family Therapy';
    case 'premarital-counselling': return 'Premarital Counselling';
    case 'couples-counselling': return 'Couples Counselling';
    case 'sexual-health-counselling': return 'Sexual Health Counselling';
    
    // Legal Services
    case 'pre-marriage-legal': return 'Pre-marriage Legal Consultation';
    case 'mediation': return 'Mediation Services';
    case 'divorce': return 'Divorce Consultation';
    case 'custody': return 'Child Custody Consultation';
    case 'maintenance': return 'Maintenance Consultation';
    case 'general-legal': return 'General Legal Consultation';
    
    // Legacy options
    case 'mental-health': return 'Mental Health Support';
    case 'legal': return 'Legal Consultation';
    case 'therapy': return 'Relationship Therapy';
    case 'combined': return 'Combined Support';
    default: return '';
  }
};

export const getConsultationPrice = (type: string) => {
  // Legal consultations
  if (type.includes('legal') || 
      type === 'divorce' || 
      type === 'custody' || 
      type === 'mediation' || 
      type === 'maintenance') {
    return '₹7,999';
  }
  
  // Mental health services
  if (type.includes('counselling') || 
      type === 'mental-health' || 
      type === 'therapy' || 
      type === 'family-therapy') {
    return '₹5,999';
  }
  
  // Combined support (legacy)
  if (type === 'combined') {
    return '₹9,999';
  }
  
  // Default price
  return '₹7,499';
};

export const getTimeSlotLabel = (timeSlot: string) => {
  switch(timeSlot) {
    case '9-am': return '9:00 AM';
    case '10-am': return '10:00 AM';
    case '11-am': return '11:00 AM';
    case '1-pm': return '1:00 PM';
    case '2-pm': return '2:00 PM';
    case '3-pm': return '3:00 PM';
    case '4-pm': return '4:00 PM';
    default: return 'Not selected';
  }
};

export const checkAuthentication = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const redirectToSignIn = (navigate: (path: string) => void) => {
  toast({
    title: "Authentication Required",
    description: "Please sign in to continue booking your consultation.",
  });
  navigate("/sign-in");
};

export const storeBookingDetailsInLocalStorage = (details: any) => {
  localStorage.setItem("bookingDetails", JSON.stringify(details));
};

export const getBookingDetailsFromLocalStorage = () => {
  const details = localStorage.getItem("bookingDetails");
  return details ? JSON.parse(details) : null;
};

export const clearBookingDetailsFromLocalStorage = () => {
  localStorage.removeItem("bookingDetails");
};
