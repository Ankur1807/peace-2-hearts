
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

