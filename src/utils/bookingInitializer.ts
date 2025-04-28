
import { getBookingDetailsFromLocalStorage, clearBookingDetailsFromLocalStorage } from '@/utils/bookingStorage';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';

export function initializeBookingFromStorage(bookingState: ConsultationBookingHook): void {
  const {
    setServiceCategory,
    setSelectedServices,
    setDate,
    setTimeSlot,
    handlePersonalDetailsChange
  } = bookingState;

  // Check if there are stored booking details
  const storedDetails = getBookingDetailsFromLocalStorage();
  if (storedDetails) {
    setServiceCategory(storedDetails.serviceCategory || 'mental-health');
    
    // Check if we have selectedServices in the stored details
    // If not, use services from BookingDetails
    if (storedDetails.selectedServices) {
      setSelectedServices(storedDetails.selectedServices);
    } else if (storedDetails.services) {
      setSelectedServices(storedDetails.services);
    }
    
    setDate(storedDetails.date ? new Date(storedDetails.date) : undefined);
    setTimeSlot(storedDetails.timeSlot || '');
    
    // Handle personal details, which might be in different formats
    if (storedDetails.personalDetails) {
      handlePersonalDetailsChange(storedDetails.personalDetails);
    } else if (storedDetails.email && storedDetails.clientName) {
      // Create personal details from booking details
      const names = storedDetails.clientName.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      handlePersonalDetailsChange({
        firstName,
        lastName,
        email: storedDetails.email,
        phone: storedDetails.phone || '',
        message: storedDetails.message || ''
      });
    }
    
    // Clear the stored details after retrieving them
    clearBookingDetailsFromLocalStorage();
  }
}
