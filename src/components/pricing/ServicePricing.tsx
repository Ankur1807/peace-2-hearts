
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ServiceList from './ServiceList';
import AddServiceForm from './AddServiceForm';
import { usePricingServices } from '@/hooks/usePricingServices';
import { NewServiceFormValues } from './AddServiceForm';

const ServicePricing = () => {
  const [openNewServiceDialog, setOpenNewServiceDialog] = useState(false);
  const {
    services,
    loading,
    updating,
    editMode,
    editedPrice,
    setEditedPrice,
    fetchServices,
    handleEdit,
    handleCancel,
    handleSave,
    toggleServiceStatus,
    addNewService,
    deleteService
  } = usePricingServices();

  useEffect(() => {
    console.log('ServicePricing: Initializing');
    fetchServices(true); // Force refresh on initial load
  }, []);

  const handleRefreshClick = () => {
    fetchServices(true); // Force refresh when button is clicked
  };

  const onSubmitNewService = async (data: NewServiceFormValues) => {
    const success = await addNewService(data);
    if (success) {
      setOpenNewServiceDialog(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    const success = await deleteService(id);
    if (success) {
      fetchServices(true); // Force refresh after deletion
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Service Pricing</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshClick} disabled={loading || updating}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={openNewServiceDialog} onOpenChange={setOpenNewServiceDialog}>
            <DialogTrigger asChild>
              <Button disabled={updating}>
                <Plus className="h-4 w-4 mr-1" /> Add Service
              </Button>
            </DialogTrigger>
            <AddServiceForm onSubmit={onSubmitNewService} />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ServiceList
          services={services}
          loading={loading}
          updating={updating}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleStatus={toggleServiceStatus}
          onDelete={handleDeleteService}
          editMode={editMode}
          editedPrice={editedPrice}
          setEditedPrice={setEditedPrice}
        />
      </CardContent>
    </Card>
  );
};

export default ServicePricing;
