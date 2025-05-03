
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { updateServicePrice } from '@/utils/pricing';
import { handleOperationError } from './pricingErrorHandler';
import type { ServiceEditingState } from './types';

export const useServiceEditing = (onServiceUpdated: () => Promise<void>) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const handleEdit = (id: string, currentPrice: number) => {
    setEditMode(id);
    setEditedPrice(currentPrice.toString());
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditedPrice('');
  };

  const handleSave = async (id: string) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required - You must be logged in as an admin to update prices.',
          variant: 'destructive',
        });
        return;
      }

      if (!editedPrice.trim() || isNaN(Number(editedPrice)) || Number(editedPrice) <= 0) {
        toast({
          title: 'Invalid Price - Please enter a valid price.',
          variant: 'destructive',
        });
        return;
      }

      const numericPrice = Number(editedPrice);
      console.log(`Saving price ${numericPrice} for service ID ${id}`);
      
      await updateServicePrice(id, numericPrice);

      toast({
        title: 'Price Updated - Service price has been successfully updated.',
      });

      setEditMode(null);
      
      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await onServiceUpdated();
      }, 500);
    } catch (error: any) {
      handleOperationError(error, 'update price', toast);
    }
  };

  return {
    editMode,
    editedPrice,
    setEditedPrice,
    handleEdit,
    handleCancel,
    handleSave,
  } as ServiceEditingState & {
    handleEdit: (id: string, currentPrice: number) => void;
    handleCancel: () => void;
    handleSave: (id: string) => Promise<void>;
  };
};
