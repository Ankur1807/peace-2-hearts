
export interface PricingItem {
  id: string;
  item_id: string;
  name: string;
  type: 'service' | 'package';
  category: string;
  price: number;
  is_active: boolean;
  currency: string;
  components?: string[];
  created_at: string;
  updated_at: string;
}

export interface NewPricingItemData {
  item_id: string;
  name: string;
  type: 'service' | 'package';
  category: string;
  price: number;
  components?: string[];
}

export interface PriceHistoryItem {
  id: string;
  entity_id: string;
  item_name: string;
  item_type: string;
  old_price: number | null;
  new_price: number;
  changed_by: string | null;
  created_at: string;
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
  usage_count: number;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

