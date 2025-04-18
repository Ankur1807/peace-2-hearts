
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateDiscountCode, applyDiscountCode } from '@/utils/pricing/discountUtils';

export function useDiscountState(totalPrice: number, setTotalPrice: (price: number) => void) {
  const [discountCode, setDiscountCode] = useState<string>('');
  const [isValidatingDiscount, setIsValidatingDiscount] = useState<boolean>(false);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(totalPrice);
  const { toast } = useToast();

  // Update original price when total price changes and no discount has been applied
  if (!appliedDiscountCode && totalPrice !== originalPrice) {
    setOriginalPrice(totalPrice);
  }

  const handleDiscountCodeChange = (code: string) => {
    setDiscountCode(code);
  };

  const validateAndApplyDiscount = useCallback(async (serviceIds?: string[]) => {
    if (!discountCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsValidatingDiscount(true);
      
      const result = await validateDiscountCode(
        discountCode, 
        originalPrice,
        serviceIds
      );
      
      if (result.valid && result.discountAmount) {
        setAppliedDiscountCode(discountCode);
        setDiscountAmount(result.discountAmount);
        
        // Apply discount to the total price
        const discountedPrice = Math.max(0, originalPrice - result.discountAmount);
        setTotalPrice(discountedPrice);
        
        toast({
          title: "Discount Applied",
          description: `${result.message}`,
        });
        
        return true;
      } else {
        toast({
          title: "Invalid Code",
          description: result.message || "Invalid discount code",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error("Error validating discount:", error);
      
      toast({
        title: "Error",
        description: "Failed to validate discount code",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsValidatingDiscount(false);
    }
  }, [discountCode, originalPrice, toast, setTotalPrice]);
  
  const removeDiscount = useCallback(() => {
    if (appliedDiscountCode) {
      setAppliedDiscountCode(null);
      setDiscountCode('');
      setDiscountAmount(0);
      setTotalPrice(originalPrice);
      
      toast({
        title: "Discount Removed",
        description: "The discount code has been removed",
      });
    }
  }, [appliedDiscountCode, originalPrice, setTotalPrice, toast]);
  
  const finalizeDiscount = useCallback(async () => {
    if (appliedDiscountCode) {
      await applyDiscountCode(appliedDiscountCode);
    }
  }, [appliedDiscountCode]);

  return {
    discountCode,
    setDiscountCode: handleDiscountCodeChange,
    validateAndApplyDiscount,
    removeDiscount,
    finalizeDiscount,
    isValidatingDiscount,
    appliedDiscountCode,
    discountAmount,
    originalPrice
  };
}
