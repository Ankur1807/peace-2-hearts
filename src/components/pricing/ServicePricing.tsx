
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Plus, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServicePrice } from '@/utils/pricingTypes';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const newServiceSchema = z.object({
  service_name: z.string().min(3, { message: "Service name must be at least 3 characters" }),
  service_id: z.string().min(3, { message: "Service ID must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(3, { message: "Category is required" }),
});

const ServicePricing = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const [openNewServiceDialog, setOpenNewServiceDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newServiceSchema>>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      service_name: '',
      service_id: '',
      price: 0,
      category: 'mental-health',
    },
  });

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

  const onSubmitNewService = async (data: z.infer<typeof newServiceSchema>) => {
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

      form.reset();
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Enter the details of the new service to add to the pricing list.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitNewService)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="service_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Individual Therapy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. therapy-individual" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mental-health">Mental Health</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="holistic">Holistic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Service</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Service ID</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading services...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No services found. Click "Add Service" to create services.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium capitalize">
                      {service.category.replace('-', ' ')}
                    </TableCell>
                    <TableCell>{service.service_name}</TableCell>
                    <TableCell>{service.service_id}</TableCell>
                    <TableCell>
                      {editMode === service.id ? (
                        <Input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="w-24"
                          min="0"
                        />
                      ) : (
                        `₹${service.price.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={() => toggleServiceStatus(service.id, service.is_active)}
                        />
                        <span className={service.is_active ? 'text-green-600' : 'text-red-600'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editMode === service.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave(service.id)}
                          >
                            <Save className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(service.id, service.price)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicePricing;
