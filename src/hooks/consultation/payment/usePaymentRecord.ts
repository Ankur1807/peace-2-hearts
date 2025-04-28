
import { updateConsultationStatus } from '@/utils/payment/services/serviceUtils';
import { sendEmailForConsultation } from '@/utils/payment/services/emailNotificationService';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentStorageService';
import { BookingDetails } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';

interface PaymentRecordParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  bookingDetails?: BookingDetails;
}

export const usePaymentRecord = () => {
  const { toast } = useToast();

  const createPaymentRecord = async (params: PaymentRecordParams) => {
    try {
      console.log("Handling payment record for reference ID:", params.referenceId);
      
      // Store payment details in session
      storePaymentDetailsInSession({
        referenceId: params.referenceId,
        paymentId: params.paymentId,
        amount: params.amount,
        orderId: params.orderId,
        bookingDetails: params.bookingDetails
      });
      
      // Update consultation status
      const statusUpdated = await updateConsultationStatus(params.referenceId, 'paid');
      
      if (statusUpdated) {
        console.log("Consultation status updated successfully");
        
        // Send confirmation email
        const emailSent = await sendEmailForConsultation(null, {
          ...params.bookingDetails,
          referenceId: params.referenceId,
          amount: params.amount
        });
        
        console.log("Email sending result:", emailSent);
        return true;
      } else {
        console.error("Failed to update consultation status");
        return false;
      }
    } catch (error) {
      console.error("Error processing payment record:", error);
      return false;
    }
  };

  return { createPaymentRecord };
};
