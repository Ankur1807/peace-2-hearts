
/**
 * Type definitions for Razorpay integration
 */

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface OrderResponse {
  success: boolean;
  error?: string;
  order_id?: string;
  details?: {
    id: string;
    amount: number;
    currency: string;
    key_id?: string;
    message?: string;
  };
}

export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
}

