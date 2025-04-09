
import { PersonalDetails } from '@/utils/types';

export const isFormValid = (
  serviceCategory: string,
  selectedServices: string[],
  date: Date | undefined,
  timeSlot: string,
  timeframe: string,
  personalDetails: PersonalDetails
): boolean => {
  if (serviceCategory === 'holistic') {
    return (
      selectedServices.length > 0 &&
      timeframe !== '' &&
      personalDetails.firstName.trim() !== '' &&
      personalDetails.lastName.trim() !== '' &&
      personalDetails.email.trim() !== '' &&
      personalDetails.phone.trim() !== ''
    );
  } else {
    return (
      selectedServices.length > 0 &&
      date !== undefined &&
      timeSlot !== '' &&
      personalDetails.firstName.trim() !== '' &&
      personalDetails.lastName.trim() !== '' &&
      personalDetails.email.trim() !== '' &&
      personalDetails.phone.trim() !== ''
    );
  }
};

export default isFormValid;
