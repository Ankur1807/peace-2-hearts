
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { ServicePrice } from '@/utils/pricingTypes';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ServiceList from './ServiceList';
import AddServiceForm, { NewServiceFormValues } from './AddServiceForm';

const ServicePricing = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const [openNewServiceDialog, setOpenNewServiceDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_pricing')
        .select('*')
        .order('category', { ascending: true })
        .order('service_name', { ascending: true });

      if (error) throw error;
      
      if (data && data.length === 0) {
        // If no services found, let's add some initial services
        await addInitialServices();
        // After adding initial services, fetch them again
        const result = await supabase
          .from('service_pricing')
          .select('*')
          .order('category', { ascending: true })
          .order('service_name', { ascending: true });
          
        if (result.error) throw result.error;
        setServices(result.data as ServicePrice[] || []);
      } else {
        setServices(data as ServicePrice[] || []);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch services: ${error.message}`,
        variant: 'destructive',
      });
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInitialServices = async () => {
    const initialServices = [
      // Mental Health Services
      { service_name: 'Individual Therapy', service_id: 'therapy-individual', price: 2500, category: 'mental-health', is_active: true },
      { service_name: 'Couples Counselling', service_id: 'therapy-couples', price: 3000, category: 'mental-health', is_active: true },
      { service_name: 'Family Therapy', service_id: 'therapy-family', price: 3500, category: 'mental-health', is_active: true },
      { service_name: 'Premarital Counselling', service_id: 'therapy-premarital', price: 2800, category: 'mental-health', is_active: true },
      { service_name: 'Relationship Counselling', service_id: 'therapy-relationship', price: 3000, category: 'mental-health', is_active: true },
      
      // Legal Services
      { service_name: 'Divorce Consultation', service_id: 'legal-divorce', price: 5000, category: 'legal', is_active: true },
      { service_name: 'Child Custody Consultation', service_id: 'legal-custody', price: 4500, category: 'legal', is_active: true },
      { service_name: 'Legal Document Review', service_id: 'legal-document', price: 3000, category: 'legal', is_active: true },
      { service_name: 'Court Representation', service_id: 'legal-court', price: 10000, category: 'legal', is_active: true },
      { service_name: 'Maintenance Consultation', service_id: 'legal-maintenance', price: 3500, category: 'legal', is_active: true },
      
      // Holistic Services
      { service_name: 'Meditation Session', service_id: 'holistic-meditation', price: 1500, category: 'holistic', is_active: true },
      { service_name: 'Yoga Therapy', service_id: 'holistic-yoga', price: 1800, category: 'holistic', is_active: true },
      { service_name: 'Art Therapy', service_id: 'holistic-art', price: 2000, category: 'holistic', is_active: true },
      { service_name: 'Naturopathy Consultation', service_id: 'holistic-naturopathy', price: 2500, category: 'holistic', is_active: true },
    ];

    try {
      for (const service of initialServices) {
        const { error } = await supabase
          .from('service_pricing')
          .insert([{
            ...service,
            currency: 'INR',
            scenario: 'regular',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
          
        if (error) {
          console.error('Error adding initial service:', error);
        }
      }
      
      toast({
        title: 'Services Added',
        description: 'Initial services have been added to the database.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to add initial services: ${error.message}`,
        variant: 'destructive',
      });
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
      if (!editedPrice.trim() || isNaN(Number(editedPrice)) || Number(editedPrice) <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid price.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('service_pricing')
        .update({ price: Number(editedPrice), updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Price Updated',
        description: 'Service price has been successfully updated.',
      });

      setEditMode(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update price: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_pricing')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const onSubmitNewService = async (data: NewServiceFormValues) => {
    try {
      const { error } = await supabase
        .from('service_pricing')
        .insert([{
          service_name: data.service_name,
          service_id: data.service_id,
          price: data.price,
          category: data.category,
          currency: 'INR',
          is_active: true,
          scenario: 'regular',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: 'Service Added',
        description: 'New service has been successfully added.',
      });

      setOpenNewServiceDialog(false);
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to add service: ${error.message}`,
        variant: 'destructive',
      });
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
          <Dialog open={openNewServiceDialog} onOpenChange={setOpenNewServiceDialog}>
            <DialogTrigger asChild>
              <Button>
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
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleStatus={toggleServiceStatus}
          editMode={editMode}
          editedPrice={editedPrice}
          setEditedPrice={setEditedPrice}
        />
      </CardContent>
    </Card>
  );
};

export default ServicePricing;
