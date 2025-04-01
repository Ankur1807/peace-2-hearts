
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
    'general-legal': 'General Legal Consultation',
    'divorce-prevention': 'Divorce Prevention Package',
    'pre-marriage-clarity': 'Pre-Marriage Clarity Package'
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
    'general-legal': '₹2,500',
    'divorce-prevention': '₹10,000',
    'pre-marriage-clarity': '₹7,500'
  };
  
  return prices[type] || '₹2,000';
};

export const getTimeSlotLabel = (timeSlot: string): string => {
  const timeSlotMap: Record<string, string> = {
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
  
  return timeSlotMap[timeSlot] || timeSlot.replace('-', ' - ');
};
