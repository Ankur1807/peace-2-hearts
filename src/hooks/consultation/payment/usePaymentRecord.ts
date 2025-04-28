
import { savePaymentRecord } from '@/utils/payment/razorpayService';
import { BookingDetails, SavePaymentRecordParams } from '@/utils/types';
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
      console.log("Attempting to save payment record with reference ID:", params.referenceId);
      
      const paymentSaved = await savePaymentRecord({
        paymentId: params.paymentId,
        orderId: params.orderId,
        amount: params.amount,
        referenceId: params.referenceId,
        status: 'completed',
        bookingDetails: params.bookingDetails,
        highPriority: true
      });
      
      if (paymentSaved) {
        console.log("Payment record saved successfully");
        return true;
      } else {
        console.error("Failed to save payment record");
        return false;
      }
    } catch (error) {
      console.error("Error saving payment record:", error);
      return false;
    }
  };

  return { createPaymentRecord };
};
