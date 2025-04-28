
import { BookingDetails } from '@/utils/types';

interface CheckoutOptionsParams {
  razorpayKey: string;
  orderId: string;
  amount: number;
  currency: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  selectedServices: string[];
  receiptId: string;
}

export const useCheckoutOptions = () => {
  const createCheckoutOptions = (params: CheckoutOptionsParams) => {
    return {
      key: params.razorpayKey,
      amount: params.amount,
      currency: params.currency,
      name: "Peace2Hearts",
      description: `Payment for consultation services`,
      order_id: params.orderId,
      prefill: {
        name: `${params.personalDetails.firstName} ${params.personalDetails.lastName}`,
        email: params.personalDetails.email,
        contact: params.personalDetails.phone,
      },
      notes: {
        services: params.selectedServices.join(','),
        consultationId: params.receiptId,
        client: `${params.personalDetails.firstName} ${params.personalDetails.lastName}`
      },
      theme: {
        color: "#3399cc",
      }
    };
  };

  return { createCheckoutOptions };
};
