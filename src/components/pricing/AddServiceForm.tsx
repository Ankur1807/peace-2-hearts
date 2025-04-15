
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const newServiceSchema = z.object({
  service_name: z.string().min(3, { message: "Service name must be at least 3 characters" }),
  service_id: z.string().min(3, { message: "Service ID must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(3, { message: "Category is required" }),
});

export type NewServiceFormValues = z.infer<typeof newServiceSchema>;

interface AddServiceFormProps {
  onSubmit: (data: NewServiceFormValues) => Promise<void>;
}

const AddServiceForm = ({ onSubmit }: AddServiceFormProps) => {
  const form = useForm<NewServiceFormValues>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      service_name: '',
      service_id: '',
      price: 0,
      category: 'mental-health',
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogDescription>
          Enter the details of the new service to add to the pricing list.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};

export default AddServiceForm;

