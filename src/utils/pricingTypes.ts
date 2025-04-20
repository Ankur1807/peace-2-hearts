
// Type definitions for pricing-related database tables

export interface ServicePrice {
  id: string;
  service_id: string;
  service_name: string;
  price: number;
  currency: string;
  category: string;
  type: 'service' | 'package';
  services: string[] | null;
  is_active: boolean;
  scenario?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  description: string | null;
  applicable_services: string[] | null;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number | null;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PriceChange {
  id: string;
  entity_id: string;
  entity_type: string;
  old_price: number | null;
  new_price: number;
  changed_by: string | null;
  created_at: string;
  entity_name?: string;
}

export interface ServiceOption {
  service_id: string;
  service_name: string;
  category: string;
  price?: number;
  is_active?: boolean;
}
