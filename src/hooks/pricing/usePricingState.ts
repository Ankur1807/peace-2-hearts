
import { useState } from 'react';
import { useServiceFetching } from './useServiceFetching';
import { useServiceOperations } from './useServiceOperations';

export const usePricingServices = () => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  
  const { services, loading, fetchServices } = useServiceFetching();
  const { 
    handleToggleStatus, 
    handleEditPrice, 
    handleAddService, 
    handleDeleteService 
  } = useServiceOperations();

  const handleEdit = (id: string, currentPrice: number) => {
    setEditMode(id);
    setEditedPrice(currentPrice.toString());
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditedPrice('');
  };

  const handleSave = async (id: string) => {
    const success = await handleEditPrice(id, Number(editedPrice));
    if (success) {
      setEditMode(null);
      await fetchServices();
    }
  };

  return {
    services,
    loading,
    editMode,
    editedPrice,
    setEditedPrice,
    fetchServices,
    handleEdit,
    handleCancel,
    handleSave,
    handleToggleStatus,
    handleAddService,
    handleDeleteService,
  };
};
