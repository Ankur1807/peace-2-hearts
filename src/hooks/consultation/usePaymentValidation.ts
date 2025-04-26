
import { useCallback } from 'react';
import { PersonalDetails } from '@/utils/types';

export function usePaymentValidation() {
  // Validate personal details
  const validatePersonalDetails = useCallback((personalDetails: PersonalDetails): boolean => {
    if (!personalDetails) return false;
    
    const { firstName, lastName, email, phone } = personalDetails;
    
    // Basic validation - all fields must be non-empty
    return !!(
      firstName && 
      firstName.trim() &&
      lastName && 
      lastName.trim() &&
      email && 
      email.trim() &&
      phone && 
      phone.trim()
    );
  }, []);
  
  // Validate service selection
  const validateServiceSelection = useCallback((selectedServices: string[]): boolean => {
    return !!(selectedServices && selectedServices.length > 0);
  }, []);
  
  // Validate payment amount
  const validatePaymentAmount = useCallback((amount: number): boolean => {
    // For test service, we allow any amount including zero
    return amount >= 0;
  }, []);
  
  return {
    validatePersonalDetails,
    validateServiceSelection,
    validatePaymentAmount
  };
}
