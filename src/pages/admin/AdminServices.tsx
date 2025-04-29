
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useAdmin } from '@/hooks/useAdminContext';
import ServiceList from '@/components/pricing/ServiceList';
import AddServiceForm from '@/components/pricing/AddServiceForm';
import { useServiceFetching } from '@/hooks/pricing/useServiceFetching';
import { useServiceOperations } from '@/hooks/pricing/useServiceOperations';
import { NewServiceFormValues } from '@/utils/pricing/types';

const AdminServices: React.FC = () => {
  const [openNewServiceDialog, setOpenNewServiceDialog] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { isAdmin } = useAdmin();
  const { services, loading, fetchServices } = useServiceFetching();
  const { 
    handleToggleStatus,
    handleEditPrice,
    handleAddService,
    handleDeleteService 
  } = useServiceOperations();

  useEffect(() => {
    if (isAdmin) {
      fetchServices();
    }
  }, [isAdmin, fetchServices]);

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
      fetchServices();
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: boolean) => {
    const success = await handleToggleStatus(id, currentStatus);
    if (success) {
      fetchServices();
    }
  };

  const handleSubmitNewService = async (data: NewServiceFormValues) => {
    const success = await handleAddService(data);
    if (success) {
      setOpenNewServiceDialog(false);
      fetchServices();
    }
  };

  const handleDeleteServiceItem = async (id: string) => {
    const success = await handleDeleteService(id);
    if (success) {
      fetchServices();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Services Management</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Catalog</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchServices} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            {isAdmin && (
              <Dialog open={openNewServiceDialog} onOpenChange={setOpenNewServiceDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" /> Add Service
                  </Button>
                </DialogTrigger>
                <AddServiceForm onSubmit={handleSubmitNewService} />
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">
              <p className="font-medium">Authentication Required</p>
              <p>You must be logged in as an admin to access service management.</p>
            </div>
          )}
          <ServiceList
            services={services}
            loading={loading}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onToggleStatus={handleToggleServiceStatus}
            onDelete={handleDeleteServiceItem}
            editMode={editMode}
            editedPrice={editedPrice}
            setEditedPrice={setEditedPrice}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
