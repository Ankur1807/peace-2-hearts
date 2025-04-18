
import { supabase } from '@/integrations/supabase/client';
import { PriceHistoryItem } from '../types/pricingTypes';

export async function fetchPricingHistory(): Promise<PriceHistoryItem[]> {
  try {
    // First, fetch the pricing history records
    const { data: historyData, error: historyError } = await supabase
      .from('pricing_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (historyError) {
      console.error('Error fetching pricing history:', historyError);
      throw historyError;
    }
    
    if (!historyData) {
      return [];
    }
    
    // Now fetch all pricing items to get their names
    const { data: pricingItems, error: itemsError } = await supabase
      .from('pricing_items')
      .select('id, name, type');
      
    if (itemsError) {
      console.error('Error fetching pricing items:', itemsError);
      return historyData;
    }
    
    // Create a mapping of pricing item IDs to their names and types
    const itemsMap = new Map();
    if (pricingItems) {
      pricingItems.forEach(item => {
        itemsMap.set(item.id, { name: item.name, type: item.type });
      });
    }
    
    // Transform the history data, looking up item names from our map
    return historyData.map(record => ({
      id: record.id,
      entity_id: record.entity_id,
      item_name: itemsMap.get(record.entity_id)?.name || 'Unknown',
      item_type: itemsMap.get(record.entity_id)?.type || record.entity_type || 'Unknown',
      old_price: record.old_price,
      new_price: record.new_price,
      changed_by: record.changed_by,
      created_at: record.created_at
    }));
    
  } catch (error) {
    console.error('Error in fetchPricingHistory:', error);
    return [];
  }
}
