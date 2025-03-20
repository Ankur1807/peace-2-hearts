
import { getBookingDetailsFromLocalStorage, clearBookingDetailsFromLocalStorage } from '@/utils/consultationUtils';
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
    setSelectedServices(storedDetails.selectedServices || []);
    setDate(storedDetails.date ? new Date(storedDetails.date) : undefined);
    setTimeSlot(storedDetails.timeSlot || '');
    if (storedDetails.personalDetails) {
      handlePersonalDetailsChange(storedDetails.personalDetails);
    }
    // Clear the stored details after retrieving them
    clearBookingDetailsFromLocalStorage();
  }
}
