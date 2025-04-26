
export interface ServicePrice {
  id: string;
  service_id: string;
  service_name: string;
  price: number;
  category: string;
  type: 'service' | 'package';
  is_active: boolean;
  currency: string;
  scenario: string;
  created_at: string;
  updated_at: string;
  description?: string;
  services?: string[]; // Add the services array property
}

export interface PricingHistoryEntry {
  id: string;
  entity_id: string;
  entity_type: string;
  old_price: number;
  new_price: number;
  changed_by?: string;
  created_at: string;
}

// Add the missing types used in DiscountCodes.tsx
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

// Add the missing type used in DiscountCodes.tsx
export interface ServiceOption {
  id: string;
  name: string;
  category: string;
}

// Add the missing type used in PricingHistory.tsx
export interface PriceChange {
  id: string;
  entity_id: string;
  entity_name?: string;
  old_price: number;
  new_price: number;
  changed_by?: string;
  created_at: string;
}
