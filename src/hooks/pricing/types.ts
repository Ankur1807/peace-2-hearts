
// Define a clean custom interface for toast messages
export interface ToastMessage {
  title: string;
  variant?: 'default' | 'destructive';
  description?: string;
}

export type ToastFunction = (props: ToastMessage) => void;

export interface ServicePrice {
  id: string;
  service_id: string;
  service_name: string;
  price: number;
  category: string;
  type: 'service' | 'package';
  is_active: boolean;
  currency: string;
  scenario: string; // Required field
  created_at: string;
  updated_at: string;
  description?: string;
  services?: string[];
}

export interface NewServiceFormValues {
  service_name: string;
  service_id?: string;
  price: number;
  category: string;
  description?: string;
  type?: 'service' | 'package';
  is_active?: boolean;
  currency?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description?: string;
  is_active: boolean;
  expiry_date?: string;
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  applicable_services?: string[];
}

export interface ServiceOption {
  id: string;
  name: string;
  category: string;
}
