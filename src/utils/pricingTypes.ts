
// Types for pricing management

export interface ServicePrice {
  id: string;
  service_name: string;
  service_id: string;
  price: number;
  category: string;
  type: 'service' | 'package';
  is_active: boolean;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  services?: string[];
  scenario?: string;
}

export interface PricingHistory {
  id: string;
  entity_id: string;
  entity_type: string;
  old_price: number;
  new_price: number;
  changed_by?: string;
  created_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  is_active: boolean;
  start_date?: string;
  expiry_date?: string;
  usage_limit?: number;
  usage_count?: number;
  description?: string;
  applicable_services?: string[];
  created_at: string;
  updated_at: string;
}

// Added missing types
export interface ServiceOption {
  service_id: string;
  service_name: string;
  category: string;
}

export interface PriceChange extends PricingHistory {
  entity_name?: string;
}
