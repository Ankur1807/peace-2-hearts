
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

/**
 * Fetches all pricing items with optional filters
 */
export async function fetchPricingItems(type?: 'service' | 'package', forceRefresh = false) {
  console.log(`Fetching pricing items${type ? ` of type ${type}` : ''}, forceRefresh: ${forceRefresh}`);
  
  try {
    // Add cache busting if needed
    const timestamp = forceRefresh ? `?t=${Date.now()}` : '';
    
    let query = supabase
      .from('pricing_items')
      .select('*')
      .order('category')
      .order('name');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching pricing items:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} pricing items`);
    return data as PricingItem[];
  } catch (error) {
    console.error('Error in fetchPricingItems:', error);
    throw error;
  }
}

/**
 * Fetches a single pricing item by ID
 */
export async function fetchPricingItemById(id: string) {
  try {
    const { data, error } = await supabase
      .from('pricing_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching pricing item:', error);
      throw error;
    }
    
    return data as PricingItem;
  } catch (error) {
    console.error('Error in fetchPricingItemById:', error);
    throw error;
  }
}

/**
 * Updates a pricing item's price
 */
export async function updatePricingItemPrice(id: string, price: number) {
  console.log(`Updating pricing item ${id} price to ${price}`);
  
  try {
    // First verify the item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('pricing_items')
      .select('id, price')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Error checking item existence:', checkError);
      throw checkError;
    }
    
    if (!existingItem) {
      throw new Error(`Pricing item with ID ${id} not found`);
    }
    
    // Update the price
    const { data, error } = await supabase
      .from('pricing_items')
      .update({ price })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating pricing item:', error);
      throw error;
    }
    
    console.log('Price updated successfully:', data);
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in updatePricingItemPrice:', error);
    throw error;
  }
}

/**
 * Toggles a pricing item's active status
 */
export async function togglePricingItemStatus(id: string, currentStatus: boolean) {
  console.log(`Toggling pricing item ${id} active status from ${currentStatus} to ${!currentStatus}`);
  
  try {
    const { data, error } = await supabase
      .from('pricing_items')
      .update({ is_active: !currentStatus })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error toggling pricing item status:', error);
      throw error;
    }
    
    console.log('Status toggled successfully:', data);
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in togglePricingItemStatus:', error);
    throw error;
  }
}

/**
 * Creates a new pricing item
 */
export async function createPricingItem(itemData: NewPricingItemData) {
  console.log('Creating new pricing item:', itemData);
  
  try {
    const { data, error } = await supabase
      .from('pricing_items')
      .insert([itemData])
      .select();
    
    if (error) {
      console.error('Error creating pricing item:', error);
      throw error;
    }
    
    console.log('New pricing item created successfully:', data);
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in createPricingItem:', error);
    throw error;
  }
}

/**
 * Removes a pricing item
 */
export async function removePricingItem(id: string) {
  console.log(`Removing pricing item with ID ${id}`);
  
  try {
    const { data, error } = await supabase
      .from('pricing_items')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error removing pricing item:', error);
      throw error;
    }
    
    console.log('Pricing item removed successfully:', data);
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in removePricingItem:', error);
    throw error;
  }
}

// Define interface for the price history item
interface PriceHistoryItem {
  id: string;
  entity_id: string;
  item_name: string;
  item_type: string;
  old_price: number | null;
  new_price: number;
  changed_by: string | null;
  created_at: string;
}

/**
 * Fetches pricing history
 */
export async function fetchPricingHistory() {
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
      // Continue with the history data we have
    }
    
    // Create a mapping of pricing item IDs to their names and types
    const itemsMap = new Map();
    if (pricingItems) {
      pricingItems.forEach(item => {
        itemsMap.set(item.id, { name: item.name, type: item.type });
      });
    }
    
    // Transform the history data, looking up item names from our map
    const transformedData = historyData.map(record => {
      const itemInfo = itemsMap.get(record.entity_id);
      
      return {
        id: record.id,
        entity_id: record.entity_id,
        item_name: itemInfo ? itemInfo.name : 'Unknown',
        item_type: itemInfo ? itemInfo.type : record.entity_type || 'Unknown',
        old_price: record.old_price,
        new_price: record.new_price,
        changed_by: record.changed_by,
        created_at: record.created_at
      };
    });
    
    return transformedData as PriceHistoryItem[];
  } catch (error) {
    console.error('Error in fetchPricingHistory:', error);
    return [];
  }
}
