
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DiscountCode } from '@/utils/pricingTypes';

interface NewDiscountCodeData {
  code: string;
  discount_type: string;
  discount_value: number;
  description: string | null;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  start_date: string | null;
  expiry_date: string | null;
  applicable_services: string[] | null;
}

interface UpdateDiscountCodeData extends NewDiscountCodeData {
  is_active?: boolean;
}

export function useDiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      setDiscountCodes(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch discount codes');
      console.error('Error fetching discount codes:', err);
      
      toast({
        title: "Error",
        description: err.message || "Failed to fetch discount codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addDiscountCode = async (data: NewDiscountCodeData): Promise<void> => {
    try {
      const { error: insertError } = await supabase
        .from('discount_codes')
        .insert([data]);
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      // Refresh the list after adding
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Error adding discount code:', err);
      throw err;
    }
  };

  const updateDiscountCode = async (id: string, data: UpdateDiscountCodeData): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('discount_codes')
        .update(data)
        .eq('id', id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Refresh the list after updating
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Error updating discount code:', err);
      throw err;
    }
  };

  const toggleDiscountStatus = async (id: string, currentStatus: boolean): Promise<void> => {
    try {
      const { error: updateError } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Refresh the list after toggling status
      fetchDiscountCodes();
      
      toast({
        title: "Status Updated",
        description: `Discount code status changed to ${currentStatus ? 'inactive' : 'active'}`
      });
    } catch (err: any) {
      console.error('Error toggling discount code status:', err);
      throw err;
    }
  };

  const deleteDiscountCode = async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Refresh the list after deletion
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Error deleting discount code:', err);
      throw err;
    }
  };

  // Load discount codes when component mounts
  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  return {
    discountCodes,
    loading,
    error,
    fetchDiscountCodes,
    addDiscountCode,
    updateDiscountCode,
    toggleDiscountStatus,
    deleteDiscountCode
  };
}
