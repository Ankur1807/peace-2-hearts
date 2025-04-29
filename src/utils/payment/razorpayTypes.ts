
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
  razorpayKey: string; // Added to match our implementation
  order: {
    id: string;
  }; // Added to match our implementation
}

// Payment verification parameters
export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
  referenceId: string;
}
