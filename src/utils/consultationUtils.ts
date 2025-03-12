
import { toast } from "@/hooks/use-toast";

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
    case 'mental-health': return 'Mental Health Support';
    case 'legal': return 'Legal Consultation';
    case 'therapy': return 'Relationship Therapy';
    case 'combined': return 'Combined Support';
    default: return '';
  }
};

export const getConsultationPrice = (type: string) => {
  return type === 'combined' ? '$199.00' : '$149.00';
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

export const checkAuthentication = (): boolean => {
  const userData = localStorage.getItem("user");
  return !!userData;
};

export const redirectToSignIn = (navigate: (path: string) => void) => {
  toast({
    title: "Authentication Required",
    description: "Please sign in to continue booking your consultation.",
  });
  navigate("/sign-in");
};
