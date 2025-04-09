
export function usePaymentValidation() {
  const validatePersonalDetails = (personalDetails: any) => {
    return Boolean(
      personalDetails.firstName && 
      personalDetails.lastName &&
      personalDetails.email &&
      personalDetails.phone
    );
  };
  
  const validateServiceSelection = (selectedServices: string[]) => {
    return selectedServices.length > 0;
  };
  
  const validatePaymentAmount = (amount: number) => {
    return amount > 0;
  };
  
  return {
    validatePersonalDetails,
    validateServiceSelection,
    validatePaymentAmount
  };
}
