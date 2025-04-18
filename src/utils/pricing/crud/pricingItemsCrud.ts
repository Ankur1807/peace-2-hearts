
import { supabase } from '@/integrations/supabase/client';
import { PricingItem, NewPricingItemData } from '../types/pricingTypes';
import { checkAdminPermission } from '../auth/pricingAuth';

export async function fetchPricingItems(type?: 'service' | 'package', forceRefresh = false) {
  console.log(`Fetching pricing items${type ? ` of type ${type}` : ''}, forceRefresh: ${forceRefresh}`);
  
  try {
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

export async function fetchPricingItemById(id: string): Promise<PricingItem> {
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

export async function updatePricingItemPrice(id: string, price: number): Promise<PricingItem> {
  console.log(`Updating pricing item ${id} price to ${price}`);
  
  try {
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      throw new Error('You do not have permission to update pricing items');
    }
    
    const { data: existingItem, error: checkError } = await supabase
      .from('pricing_items')
      .select('id, price')
      .eq('id', id)
      .single();
    
    if (checkError || !existingItem) {
      throw new Error(`Pricing item with ID ${id} not found`);
    }
    
    const { data, error } = await supabase
      .from('pricing_items')
      .update({ price })
      .eq('id', id)
      .select();
    
    if (error || !data?.length) {
      throw error || new Error('Failed to update price');
    }
    
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in updatePricingItemPrice:', error);
    throw error;
  }
}

export async function togglePricingItemStatus(id: string, currentStatus: boolean): Promise<PricingItem> {
  try {
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      throw new Error('You do not have permission to update pricing items');
    }
    
    const { data, error } = await supabase
      .from('pricing_items')
      .update({ is_active: !currentStatus })
      .eq('id', id)
      .select();
    
    if (error || !data?.length) {
      throw error || new Error('Failed to toggle status');
    }
    
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in togglePricingItemStatus:', error);
    throw error;
  }
}

export async function createPricingItem(itemData: NewPricingItemData): Promise<PricingItem> {
  try {
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      throw new Error('You do not have permission to create pricing items');
    }
    
    const { data, error } = await supabase
      .from('pricing_items')
      .insert([itemData])
      .select();
    
    if (error || !data?.length) {
      throw error || new Error('Failed to create pricing item');
    }
    
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in createPricingItem:', error);
    throw error;
  }
}

export async function removePricingItem(id: string): Promise<PricingItem> {
  try {
    const isAdmin = await checkAdminPermission();
    if (!isAdmin) {
      throw new Error('You do not have permission to delete pricing items');
    }
    
    const { data, error } = await supabase
      .from('pricing_items')
      .delete()
      .eq('id', id)
      .select();
    
    if (error || !data?.length) {
      throw error || new Error('Failed to remove pricing item');
    }
    
    return data[0] as PricingItem;
  } catch (error) {
    console.error('Error in removePricingItem:', error);
    throw error;
  }
}
