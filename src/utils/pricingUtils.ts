
import { supabase } from "@/integrations/supabase/client";

export type ServicePrice = {
  id: string;
  service_id: string;
  service_name: string;
  price: number;
  category: string;
  scenario: string;
  currency: string;
};

export type PackagePrice = {
  id: string;
  package_id: string;
  package_name: string;
  price: number;
  services: string[];
  currency: string;
};

export type DiscountCode = {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  applicable_services: string[] | null;
};

// Fetch the price for a specific service
export const fetchServicePrice = async (
  serviceId: string, 
  scenario: string = 'regular'
): Promise<ServicePrice | null> => {
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .eq('service_id', serviceId)
      .eq('scenario', scenario)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching service price:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchServicePrice:', error);
    return null;
  }
};

// Fetch all active service prices
export const fetchAllServicePrices = async (): Promise<ServicePrice[]> => {
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .eq('is_active', true)
      .order('service_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching service prices:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllServicePrices:', error);
    return [];
  }
};

// Fetch a specific package price
export const fetchPackagePrice = async (packageId: string): Promise<PackagePrice | null> => {
  try {
    const { data, error } = await supabase
      .from('package_pricing')
      .select('*')
      .eq('package_id', packageId)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching package price:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchPackagePrice:', error);
    return null;
  }
};

// Fetch all active package prices
export const fetchAllPackagePrices = async (): Promise<PackagePrice[]> => {
  try {
    const { data, error } = await supabase
      .from('package_pricing')
      .select('*')
      .eq('is_active', true)
      .order('package_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching package prices:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllPackagePrices:', error);
    return [];
  }
};

// Validate a discount code
export const validateDiscountCode = async (
  code: string,
  services: string[],
  totalAmount: number
): Promise<{ valid: boolean; discount: DiscountCode | null; message: string }> => {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();
    
    if (error) {
      return { valid: false, discount: null, message: 'Invalid discount code' };
    }
    
    const discount = data as DiscountCode;
    
    // Check if code has expired
    if (discount.expiry_date && new Date(discount.expiry_date) < new Date()) {
      return { valid: false, discount: null, message: 'This discount code has expired' };
    }
    
    // Check if minimum purchase requirement is met
    if (discount.min_purchase_amount && totalAmount < discount.min_purchase_amount) {
      return { 
        valid: false, 
        discount: null, 
        message: `This code requires a minimum purchase of ${discount.min_purchase_amount}`
      };
    }
    
    // Check if code is applicable to selected services
    if (discount.applicable_services && discount.applicable_services.length > 0) {
      const isApplicable = services.some(service => discount.applicable_services!.includes(service));
      if (!isApplicable) {
        return { 
          valid: false, 
          discount: null, 
          message: 'This discount code is not applicable to selected services' 
        };
      }
    }
    
    return { valid: true, discount, message: 'Discount code applied successfully' };
  } catch (error) {
    console.error('Error in validateDiscountCode:', error);
    return { valid: false, discount: null, message: 'Error validating discount code' };
  }
};

// Calculate the discount amount
export const calculateDiscount = (
  totalAmount: number, 
  discount: DiscountCode
): number => {
  if (!discount) return 0;
  
  let discountAmount = 0;
  
  if (discount.discount_type === 'percentage') {
    discountAmount = (totalAmount * discount.discount_value) / 100;
    
    // Apply maximum discount cap if specified
    if (discount.max_discount_amount && discountAmount > discount.max_discount_amount) {
      discountAmount = discount.max_discount_amount;
    }
  } else {
    // Fixed amount discount
    discountAmount = discount.discount_value;
    
    // Ensure discount doesn't exceed order total
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }
  }
  
  return discountAmount;
};
