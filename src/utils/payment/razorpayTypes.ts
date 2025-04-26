
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
  order?: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
    notes?: Record<string, string>;
  };
  key_id?: string; // Add key_id to response type
  error?: string;
  details?: any;
}

export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
}

export interface SavePaymentParams {
  paymentId: string;
  orderId: string;
  amount: number;
  consultationId: string;
}
