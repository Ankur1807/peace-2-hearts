
import { supabase } from '@/integrations/supabase/client';
import { DiscountCode } from '@/utils/pricingTypes';

/**
 * Validates a discount code against various criteria
 */
export async function validateDiscountCode(
  code: string, 
  totalAmount: number,
  serviceIds?: string[]
): Promise<{
  valid: boolean;
  discountCode?: DiscountCode;
  message?: string;
  discountAmount?: number;
}> {
  try {
    console.log(`Validating discount code: ${code} for amount: ${totalAmount}`);
    
    // Fetch discount code from database
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error || !data) {
      console.log('Discount code not found or inactive');
      return { valid: false, message: 'Invalid discount code' };
    }
    
    const discountCode = data as DiscountCode;
    
    // Check if the code is within valid date range
    const now = new Date();
    if (discountCode.start_date && new Date(discountCode.start_date) > now) {
      console.log('Discount code not yet valid');
      return {
        valid: false,
        message: `This code will be valid from ${new Date(discountCode.start_date).toLocaleDateString()}`
      };
    }
    
    if (discountCode.expiry_date && new Date(discountCode.expiry_date) < now) {
      console.log('Discount code expired');
      return {
        valid: false,
        message: `This code expired on ${new Date(discountCode.expiry_date).toLocaleDateString()}`
      };
    }
    
    // Check if the code has reached usage limit
    if (discountCode.usage_limit && discountCode.usage_count >= discountCode.usage_limit) {
      console.log('Discount code reached usage limit');
      return {
        valid: false,
        message: 'This discount code has reached its maximum usage limit'
      };
    }
    
    // Check minimum purchase amount
    if (discountCode.min_purchase_amount && totalAmount < discountCode.min_purchase_amount) {
      console.log('Minimum purchase amount not met');
      return {
        valid: false,
        message: `This code requires a minimum purchase of ₹${discountCode.min_purchase_amount}`
      };
    }
    
    // Check service applicability
    if (
      discountCode.applicable_services && 
      discountCode.applicable_services.length > 0 &&
      serviceIds && 
      serviceIds.length > 0
    ) {
      const hasApplicableService = serviceIds.some(id => 
        discountCode.applicable_services!.includes(id)
      );
      
      if (!hasApplicableService) {
        console.log('No applicable services found');
        return {
          valid: false,
          message: 'This discount code is not applicable to the selected services'
        };
      }
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.discount_type === 'percentage') {
      discountAmount = (totalAmount * discountCode.discount_value) / 100;
      console.log(`Calculated percentage discount: ${discountAmount}`);
    } else {
      discountAmount = discountCode.discount_value;
      console.log(`Applied fixed discount: ${discountAmount}`);
    }
    
    // Apply maximum discount cap if applicable
    if (discountCode.max_discount_amount && discountAmount > discountCode.max_discount_amount) {
      discountAmount = discountCode.max_discount_amount;
      console.log(`Capped discount at maximum allowed: ${discountAmount}`);
    }
    
    return {
      valid: true,
      discountCode,
      discountAmount,
      message: 'Discount applied successfully'
    };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return { valid: false, message: 'Error validating discount code' };
  }
}

/**
 * Apply a discount code and increment its usage count
 */
export async function applyDiscountCode(code: string): Promise<boolean> {
  try {
    // Get the current code
    const { data, error } = await supabase
      .from('discount_codes')
      .select('usage_count')
      .eq('code', code.toUpperCase())
      .single();
      
    if (error || !data) return false;
    
    // Increment usage count
    const { error: updateError } = await supabase
      .from('discount_codes')
      .update({ usage_count: (data.usage_count || 0) + 1 })
      .eq('code', code.toUpperCase());
    
    return !updateError;
  } catch (error) {
    console.error('Error applying discount code:', error);
    return false;
  }
}
