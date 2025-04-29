
// Order creation parameters
export interface CreateOrderParams {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}

// Order response from API
export interface OrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  success?: boolean;
  error?: string;
  order_id?: string;
  details?: {
    id: string;
    key_id?: string;
    amount: number;
    currency: string;
  };
  razorpayKey?: string;
  order?: {
    id: string;
  };
}

// Payment verification parameters
export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
  referenceId: string;
}
