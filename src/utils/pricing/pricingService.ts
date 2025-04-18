
import { supabase } from '@/integrations/supabase/client';
import { PricingItem, NewPricingItemData } from '@/utils/pricing/pricingOperations';

/**
 * Service for fetching client-side pricing data
 */
export async function getPricingForPublicDisplay(itemIds?: string[]) {
  try {
    console.log('Fetching pricing data for public display:', itemIds);
    
    let query = supabase
      .from('pricing_items')
      .select('item_id, price, is_active')
      .eq('is_active', true);
    
    if (itemIds && itemIds.length > 0) {
      query = query.in('item_id', itemIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching public pricing data:', error);
      throw error;
    }
    
    // Map to a more convenient format for the client
    const pricingMap = new Map<string, number>();
    (data || []).forEach(item => {
      if (item.is_active) {
        pricingMap.set(item.item_id, item.price);
      }
    });
    
    return pricingMap;
  } catch (error) {
    console.error('Error in getPricingForPublicDisplay:', error);
    return new Map<string, number>();
  }
}

/**
 * Get package price or calculate from components if needed
 */
export async function getPackagePrice(packageId: string): Promise<number> {
  try {
    // First try to get the package as a direct pricing item
    const { data: packageData, error: packageError } = await supabase
      .from('pricing_items')
      .select('price, components')
      .eq('item_id', packageId)
      .eq('is_active', true)
      .eq('type', 'package')
      .single();
    
    if (!packageError && packageData) {
      return packageData.price;
    }
    
    // If no direct package, calculate from components if available
    if (packageData?.components && packageData.components.length > 0) {
      const componentIds = packageData.components;
      const { data: components, error: componentsError } = await supabase
        .from('pricing_items')
        .select('price')
        .in('item_id', componentIds)
        .eq('is_active', true);
      
      if (!componentsError && components && components.length > 0) {
        return components.reduce((sum, item) => sum + item.price, 0);
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting package price:', error);
    return 0;
  }
}

/**
 * Format price for display
 */
export function formatPrice(price?: number | null, currency: string = 'INR'): string {
  if (price == null || isNaN(price)) {
    return 'Price not available';
  }
  
  if (currency === 'INR') {
    return `₹${price.toLocaleString()}`;
  }
  
  return `${price.toLocaleString()} ${currency}`;
}
