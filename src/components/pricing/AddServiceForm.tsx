
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

const newServiceSchema = z.object({
  service_name: z.string().min(3, { message: "Service name must be at least 3 characters" }),
  service_id: z.string().min(3, { message: "Service ID must be at least 3 characters" }).optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(3, { message: "Category is required" }),
  type: z.enum(['service', 'package']).default('service'),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
});

export type NewServiceFormValues = z.infer<typeof newServiceSchema>;

interface AddServiceFormProps {
  onSubmit: (data: NewServiceFormValues) => Promise<void>;
}

const AddServiceForm = ({ onSubmit }: AddServiceFormProps) => {
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<NewServiceFormValues>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      service_name: '',
      service_id: '',
      price: 0,
      category: 'mental-health',
      type: 'service',
      is_active: true,
      description: '',
    },
  });
  
  const handleSubmit = async (data: NewServiceFormValues) => {
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogDescription>
          Enter the details of the new service to add to the pricing list.
        </DialogDescription>
      </DialogHeader>
      
      {error && (
        <div className="flex items-center p-3 border border-red-200 rounded-md bg-red-50 text-red-700">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <FormLabel>Service ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. therapy-individual (if blank, will be auto-generated)" {...field} />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to auto-generate based on the service name and category.
                </p>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="service">Individual Service</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter service description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable this to make the service available for booking
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit">Add Service</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddServiceForm;
