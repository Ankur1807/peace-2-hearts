
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ServiceList from './ServiceList';
import AddServiceForm from './AddServiceForm';
import { usePricingServices } from '@/hooks/usePricingServices';
import { NewServiceFormValues, ServicePrice } from '@/utils/pricing/types';
import { useAdmin } from '@/hooks/useAdminContext';

const ServicePricing = () => {
  const [openNewServiceDialog, setOpenNewServiceDialog] = useState(false);
  const { isAdmin } = useAdmin();
  const {
    services,
    loading,
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
    if (isAdmin) {
      fetchServices();
    }
  }, [isAdmin, fetchServices]);

  const onSubmitNewService = async (data: NewServiceFormValues) => {
    const success = await addNewService(data);
    if (success) {
      setOpenNewServiceDialog(false);
      fetchServices();
    }
  };

  const handleDeleteService = async (id: string) => {
    const success = await deleteService(id);
    if (success) {
      fetchServices();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Service Pricing</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => fetchServices()} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          {isAdmin && (
            <Dialog open={openNewServiceDialog} onOpenChange={setOpenNewServiceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Add Service
                </Button>
              </DialogTrigger>
              <AddServiceForm onSubmit={onSubmitNewService} />
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isAdmin && (
          <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">Authentication Required</p>
            <p>You must be logged in as an admin to access pricing data.</p>
          </div>
        )}
        <ServiceList
          services={services}
          loading={loading}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleStatus={toggleServiceStatus}
          onDelete={handleDeleteService}
          editMode={editMode}
          editedPrice={editedPrice}
          setEditedPrice={setEditedPrice}
          isAdmin={isAdmin}
        />
      </CardContent>
    </Card>
  );
};

export default ServicePricing;
