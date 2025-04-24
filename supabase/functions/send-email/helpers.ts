
// Helper functions for email formatting and content generation

// Map service IDs to human-readable names
export function formatServiceName(serviceId: string): string {
  const serviceNames: Record<string, string> = {
    'mental-health-counselling': 'Mental Health Counseling',
    'family-therapy': 'Family Therapy',
    'premarital-counselling': 'Premarital Counseling',
    'couples-counselling': 'Couples Counseling',
    'sexual-health-counselling': 'Sexual Health Counseling',
    'pre-marriage-legal': 'Pre-Marriage Legal Consultation',
    'mediation': 'Mediation Services',
    'divorce': 'Divorce Consultation',
    'custody': 'Child Custody Consultation',
    'maintenance': 'Maintenance Consultation',
    'general-legal': 'General Legal Consultation'
  };
  
  return serviceNames[serviceId] || serviceId;
}

// Map timeframe IDs to human-readable formats
export function formatTimeframe(timeframe: string): string {
  const timeframes: Record<string, string> = {
    '1-2-weeks': '1-2 weeks',
    '2-4-weeks': '2-4 weeks',
    '4-weeks-plus': '4+ weeks'
  };
  
  return timeframes[timeframe] || timeframe;
}

// Format date to readable string - fixed to handle date properly
export function formatDate(date?: Date | string): string {
  if (!date) return 'To be determined';
  
  // Ensure we have a Date object
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  return dateObject.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Format time slot to readable string
export function formatTimeSlot(timeSlot?: string): string {
  if (!timeSlot) return 'To be determined';
  
  const timeSlots: Record<string, string> = {
    '7-am': '7:00 AM',
    '8-am': '8:00 AM',
    '9-am': '9:00 AM',
    '10-am': '10:00 AM',
    '11-am': '11:00 AM',
    '12-pm': '12:00 PM',
    '1-pm': '1:00 PM',
    '2-pm': '2:00 PM',
    '3-pm': '3:00 PM',
    '4-pm': '4:00 PM',
    '5-pm': '5:00 PM',
    '6-pm': '6:00 PM',
    '7-pm': '7:00 PM',
    '8-pm': '8:00 PM',
    '9-pm': '9:00 PM'
  };
  
  return timeSlots[timeSlot] || timeSlot;
}
