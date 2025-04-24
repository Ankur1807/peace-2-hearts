
// Types for Razorpay service

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface OrderResponse {
  success: boolean;
  order_id?: string;
  error?: string;
  details?: any;
}

export interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature?: string;
}

export interface SavePaymentParams {
  paymentId: string;
  orderId: string;
  amount: number;
  consultationId: string;
}

export interface RazorpayOrderOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
}
