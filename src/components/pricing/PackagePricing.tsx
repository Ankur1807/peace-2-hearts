
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import PricingItemsList from './PricingItemsList';
import AddPricingItemForm from './AddPricingItemForm';
import { usePricingItems } from '@/hooks/usePricingItems';
import { NewPricingItemFormValues } from './AddPricingItemForm';

const PackagePricing = () => {
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const {
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
    deleteItem
  } = usePricingItems('package');

  useEffect(() => {
    console.log('PackagePricing: Initializing');
    fetchItems(true); // Force refresh on initial load
  }, []);

  const handleRefreshClick = () => {
    fetchItems(true); // Force refresh when button is clicked
  };

  const onSubmitNewItem = async (data: NewPricingItemFormValues) => {
    // Ensure all required fields are present and match the NewPricingItemData interface
    const itemData = {
      name: data.name,
      item_id: data.item_id,
      price: data.price,
      category: 'package', // Force category to be package
      type: 'package' as const // Force type to be package
    };
    
    const success = await addNewItem(itemData);
    if (success) {
      setOpenNewItemDialog(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Package Pricing</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshClick} disabled={loading || updating}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={openNewItemDialog} onOpenChange={setOpenNewItemDialog}>
            <DialogTrigger asChild>
              <Button disabled={updating}>
                <Plus className="h-4 w-4 mr-1" /> Add Package
              </Button>
            </DialogTrigger>
            <AddPricingItemForm onSubmit={onSubmitNewItem} />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <PricingItemsList
          items={items}
          loading={loading}
          updating={updating}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleStatus={toggleItemStatus}
          onDelete={deleteItem}
          editMode={editMode}
          editedPrice={editedPrice}
          setEditedPrice={setEditedPrice}
        />
      </CardContent>
    </Card>
  );
};

export default PackagePricing;
