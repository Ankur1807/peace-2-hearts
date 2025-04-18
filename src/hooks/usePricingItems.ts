
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  PricingItem, 
  NewPricingItemData,
  fetchPricingItems,
  updatePricingItemPrice,
  togglePricingItemStatus,
  createPricingItem,
  removePricingItem
} from '@/utils/pricing/pricingOperations';

export const usePricingItems = (itemType?: 'service' | 'package') => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();

  const fetchItems = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      console.log(`Fetching ${itemType || 'all'} items, forceRefresh: ${forceRefresh}`);
      
      const data = await fetchPricingItems(itemType, forceRefresh);
      setItems(data);
      
      console.log('Items fetched successfully:', data.length);
      
      return data;
    } catch (error: any) {
      console.error(`Error fetching ${itemType || 'all'} items:`, error);
      
      if (error.code === 'PGRST116') {
        toast({
          title: 'Authentication Error',
          description: 'You need to be logged in as an admin to access pricing data.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to fetch items: ${error.message}`,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
      setUpdating(true);
      
      // Validate the price
      if (!editedPrice.trim() || isNaN(Number(editedPrice)) || Number(editedPrice) < 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid positive price.',
          variant: 'destructive',
        });
        return;
      }

      const newPrice = Number(editedPrice);
      console.log(`Saving price update for item ${id}: ${newPrice}`);
      
      await updatePricingItemPrice(id, newPrice);
      
      // Reset edit mode
      setEditMode(null);
      setEditedPrice('');
      
      toast({
        title: 'Price Updated',
        description: 'Price has been successfully updated.',
      });
      
      // Refresh the items list with force refresh
      await fetchItems(true);
    } catch (error: any) {
      handleOperationError(error, 'update price');
    } finally {
      setUpdating(false);
    }
  };

  const toggleItemStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(true);
      
      await togglePricingItemStatus(id, currentStatus);
      
      toast({
        title: 'Status Updated',
        description: `Item ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      // Refresh with force refresh
      await fetchItems(true);
    } catch (error: any) {
      handleOperationError(error, 'update status');
    } finally {
      setUpdating(false);
    }
  };

  const addNewItem = async (data: NewPricingItemData) => {
    try {
      setUpdating(true);
      
      await createPricingItem(data);
      
      toast({
        title: 'Item Added',
        description: 'New item has been successfully added.',
      });

      // Refresh with force refresh
      await fetchItems(true);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'add item');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setUpdating(true);
      
      await removePricingItem(id);
      
      toast({
        title: 'Item Deleted',
        description: 'Item has been successfully deleted.',
      });

      // Refresh with force refresh
      await fetchItems(true);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete item');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Helper function to handle operation errors
  const handleOperationError = (error: any, operation: string) => {
    console.error(`Error: ${operation}:`, error);
    
    if (error.code === 'PGRST116') {
      toast({
        title: 'Permission Denied',
        description: `You do not have permission to ${operation}. Please make sure you are logged in as an admin.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to ${operation}: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return {
    items,
    loading,
    updating,
    editMode,
    editedPrice,
    setEditedPrice,
    fetchItems,
    handleEdit,
    handleCancel,
    handleSave,
    toggleItemStatus,
    addNewItem,
    deleteItem,
  };
};
