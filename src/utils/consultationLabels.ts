
import { fetchServicePrice } from './pricingUtils';

export function getConsultationTypeLabel(consultationType: string): string {
  switch (consultationType) {
    case 'mental-health-counselling':
      return 'Mental Health Counselling';
    case 'family-therapy':
      return 'Family Therapy';
    case 'premarital-counselling':
      return 'Premarital Counselling';
    case 'couples-counselling':
      return 'Couples Counselling';
    case 'sexual-health-counselling':
      return 'Sexual Health Counselling';
    case 'pre-marriage-legal':
      return 'Pre-Marriage Legal Consultation';
    case 'mediation':
      return 'Mediation Services';
    case 'divorce':
      return 'Divorce Consultation';
    case 'custody':
      return 'Child Custody Consultation';
    case 'maintenance':
      return 'Maintenance Consultation';
    case 'general-legal':
      return 'General Legal Consultation';
    default:
      return consultationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

export function getConsultationPrice(consultationType: string): string {
  // Fallback prices in case database lookup fails
  const fallbackPrices: Record<string, number> = {
    // Mental Health Services
    'mental-health-counselling': 1500,
    'family-therapy': 2000,
    'premarital-counselling': 1800,
    'couples-counselling': 2500,
    'sexual-health-counselling': 2200,
    
    // Legal Services
    'pre-marriage-legal': 2500,
    'mediation': 3000,
    'divorce': 3500,
    'custody': 3000,
    'maintenance': 2800,
    'general-legal': 2000
  };

  // The price will be fetched from the database when needed
  // This is just a placeholder, returning the fallback price for now
  return `₹${fallbackPrices[consultationType] || 2000}`;
}

// This function will be used to get the price asynchronously from the database
export async function getConsultationPriceAsync(consultationType: string, scenario: string = 'regular'): Promise<number> {
  try {
    const servicePrice = await fetchServicePrice(consultationType, scenario);
    
    if (servicePrice) {
      return servicePrice.price;
    } else {
      // Fallback to hardcoded prices if database lookup fails
      console.log(`No price found for ${consultationType}, using fallback price`);
      const fallbackPrice = getConsultationPrice(consultationType);
      return parseInt(fallbackPrice.replace('₹', ''));
    }
  } catch (error) {
    console.error('Error fetching consultation price:', error);
    const fallbackPrice = getConsultationPrice(consultationType);
    return parseInt(fallbackPrice.replace('₹', ''));
  }
}

export function getTimeSlotLabel(timeSlot: string): string {
  switch (timeSlot) {
    case '7-am':
      return '7:00 AM';
    case '8-am':
      return '8:00 AM';
    case '9-am':
      return '9:00 AM';
    case '10-am':
      return '10:00 AM';
    case '11-am':
      return '11:00 AM';
    case '12-pm':
      return '12:00 PM';
    case '1-pm':
      return '1:00 PM';
    case '2-pm':
      return '2:00 PM';
    case '3-pm':
      return '3:00 PM';
    case '4-pm':
      return '4:00 PM';
    case '5-pm':
      return '5:00 PM';
    case '6-pm':
      return '6:00 PM';
    case '7-pm':
      return '7:00 PM';
    case '8-pm':
      return '8:00 PM';
    case '9-pm':
      return '9:00 PM';
    default:
      return timeSlot;
  }
}

export function getTimeframeLabel(timeframe: string): string {
  switch (timeframe) {
    case '1-2-days':
      return '1-2 Days';
    case '3-5-days':
      return '3-5 Days';
    case '1-2-weeks':
      return '1-2 Weeks';
    case '2-4-weeks':
      return 'More than 2 Weeks';
    default:
      return timeframe.replace(/-/g, ' ');
  }
}
