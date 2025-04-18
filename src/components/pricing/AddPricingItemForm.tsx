
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewPricingItemData } from '@/utils/pricing/pricingOperations';

const pricingItemSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  item_id: z.string().min(3, { message: "Item ID must be at least 3 characters" }),
  type: z.enum(['service', 'package']),
  category: z.string().min(3, { message: "Category is required" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
});

export type NewPricingItemFormValues = z.infer<typeof pricingItemSchema>;

interface AddPricingItemFormProps {
  onSubmit: (data: NewPricingItemFormValues) => Promise<void>;
}

const AddPricingItemForm: React.FC<AddPricingItemFormProps> = ({ onSubmit }) => {
  const form = useForm<NewPricingItemFormValues>({
    resolver: zodResolver(pricingItemSchema),
    defaultValues: {
      name: '',
      item_id: '',
      type: 'service',
      category: 'mental-health',
      price: 0,
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogDescription>
          Enter the details of the new item to add to the pricing list.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Individual Therapy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="item_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. therapy-individual" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="package">Package</SelectItem>
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
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddPricingItemForm;
