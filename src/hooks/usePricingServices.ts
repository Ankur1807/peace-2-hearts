
import { useState } from 'react';
import { ServicePrice } from '@/utils/pricing/types';
import { useServiceFetching } from './pricing/useServiceFetching';
import { useServiceEditing } from './pricing/useServiceEditing';
import { useServiceStatus } from './pricing/useServiceStatus';
import { useServiceCreation } from './pricing/useServiceCreation';
import { useServiceDeletion } from './pricing/useServiceDeletion';

export const usePricingServices = () => {
  const { services, loading, fetchServices } = useServiceFetching();
  const { editMode, editedPrice, setEditedPrice, handleEdit, handleCancel, handleSave } = useServiceEditing(fetchServices);
  const { toggleStatus } = useServiceStatus(fetchServices);
  const { addNewService } = useServiceCreation(fetchServices);
  const { deleteService } = useServiceDeletion(fetchServices);

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
    toggleServiceStatus: toggleStatus,
    addNewService,
    deleteService,
  };
};
