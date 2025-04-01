
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { CalendarIcon, XCircle, Check, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DiscountCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  description: string | null;
  applicable_services: string[] | null;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number | null;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

interface ServiceOption {
  service_id: string;
  service_name: string;
  category: string;
}

const DiscountCodes = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [newCode, setNewCode] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    description: '',
    applicable_services: [] as string[],
    min_purchase_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    start_date: null as Date | null,
    expiry_date: null as Date | null,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchDiscounts();
    fetchServices();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch discount codes: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_pricing')
        .select('service_id, service_name, category')
        .order('category', { ascending: true })
        .order('service_name', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch services: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleCreateDiscount = async () => {
    try {
      // Basic validation
      if (!newCode.code.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Discount code is required',
          variant: 'destructive',
        });
        return;
      }

      if (!newCode.discount_value || isNaN(Number(newCode.discount_value)) || Number(newCode.discount_value) <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid discount value',
          variant: 'destructive',
        });
        return;
      }

      // Additional validation for percentage
      if (newCode.discount_type === 'percentage' && Number(newCode.discount_value) > 100) {
        toast({
          title: 'Validation Error',
          description: 'Percentage discount cannot exceed 100%',
          variant: 'destructive',
        });
        return;
      }

      const discountData: any = {
        code: newCode.code.toUpperCase(),
        discount_type: newCode.discount_type,
        discount_value: Number(newCode.discount_value),
        description: newCode.description || null,
        applicable_services: newCode.applicable_services.length > 0 ? newCode.applicable_services : null,
        min_purchase_amount: newCode.min_purchase_amount ? Number(newCode.min_purchase_amount) : null,
        max_discount_amount: newCode.max_discount_amount ? Number(newCode.max_discount_amount) : null,
        usage_limit: newCode.usage_limit ? Number(newCode.usage_limit) : null,
        start_date: newCode.start_date,
        expiry_date: newCode.expiry_date,
        is_active: true
      };

      const { error } = await supabase
        .from('discount_codes')
        .insert([discountData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Discount code created successfully',
      });

      // Reset form and refresh data
      setNewCode({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        description: '',
        applicable_services: [],
        min_purchase_amount: '',
        max_discount_amount: '',
        usage_limit: '',
        start_date: null,
        expiry_date: null,
      });
      
      setDialogOpen(false);
      fetchDiscounts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create discount code: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const toggleDiscountStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Discount code ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      fetchDiscounts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const handleServiceSelection = (serviceId: string) => {
    setNewCode(prev => {
      const services = [...prev.applicable_services];
      const index = services.indexOf(serviceId);
      
      if (index === -1) {
        services.push(serviceId);
      } else {
        services.splice(index, 1);
      }
      
      return {
        ...prev,
        applicable_services: services
      };
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Discount Codes</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Discount Code</DialogTitle>
              <DialogDescription>
                Create a new discount code for services and packages.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Discount Code</Label>
                  <Input
                    id="code"
                    value={newCode.code}
                    onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                    placeholder="WELCOME10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={newCode.discount_type}
                    onValueChange={(value) => setNewCode({ ...newCode, discount_type: value })}
                  >
                    <SelectTrigger id="discount_type">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    {newCode.discount_type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (₹)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    max={newCode.discount_type === 'percentage' ? "100" : undefined}
                    value={newCode.discount_value}
                    onChange={(e) => setNewCode({ ...newCode, discount_value: e.target.value })}
                    placeholder={newCode.discount_type === 'percentage' ? "10" : "500"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    min="0"
                    value={newCode.usage_limit}
                    onChange={(e) => setNewCode({ ...newCode, usage_limit: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCode.start_date ? format(newCode.start_date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCode.start_date || undefined}
                        onSelect={(date) => setNewCode({ ...newCode, start_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCode.expiry_date ? format(newCode.expiry_date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCode.expiry_date || undefined}
                        onSelect={(date) => setNewCode({ ...newCode, expiry_date: date })}
                        disabled={(date) => {
                          // Disable dates before start date
                          return newCode.start_date ? date < newCode.start_date : false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_purchase_amount">Minimum Purchase Amount (Optional)</Label>
                  <Input
                    id="min_purchase_amount"
                    type="number"
                    min="0"
                    value={newCode.min_purchase_amount}
                    onChange={(e) => setNewCode({ ...newCode, min_purchase_amount: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_discount_amount">Maximum Discount Amount (Optional)</Label>
                  <Input
                    id="max_discount_amount"
                    type="number"
                    min="0"
                    value={newCode.max_discount_amount}
                    onChange={(e) => setNewCode({ ...newCode, max_discount_amount: e.target.value })}
                    placeholder="5000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Applicable Services (Optional)</Label>
                <div className="border p-4 rounded-md max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {services.length > 0 ? (
                      <>
                        <div className="text-sm font-medium mb-2">Mental Health Services</div>
                        <div className="grid grid-cols-2 gap-2">
                          {services
                            .filter(s => s.category === 'mental-health')
                            .map(service => (
                              <div key={service.service_id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={service.service_id}
                                  checked={newCode.applicable_services.includes(service.service_id)}
                                  onChange={() => handleServiceSelection(service.service_id)}
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor={service.service_id} className="text-sm">
                                  {service.service_name}
                                </label>
                              </div>
                            ))}
                        </div>
                        
                        <div className="text-sm font-medium mt-4 mb-2">Legal Services</div>
                        <div className="grid grid-cols-2 gap-2">
                          {services
                            .filter(s => s.category === 'legal')
                            .map(service => (
                              <div key={service.service_id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={service.service_id}
                                  checked={newCode.applicable_services.includes(service.service_id)}
                                  onChange={() => handleServiceSelection(service.service_id)}
                                  className="rounded border-gray-300"
                                />
                                <label htmlFor={service.service_id} className="text-sm">
                                  {service.service_name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">Loading services...</div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Leave empty to apply to all services.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newCode.description}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                  placeholder="Special discount for new customers"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDiscount}>
                Create Discount
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading discount codes...
                  </TableCell>
                </TableRow>
              ) : discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No discount codes found
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.code}</TableCell>
                    <TableCell className="capitalize">
                      {discount.discount_type}
                    </TableCell>
                    <TableCell>
                      {discount.discount_type === 'percentage'
                        ? `${discount.discount_value}%`
                        : `₹${discount.discount_value}`}
                    </TableCell>
                    <TableCell>
                      {discount.start_date || discount.expiry_date ? (
                        <span className="text-sm">
                          {discount.start_date ? formatDate(discount.start_date) : 'Any time'} to{' '}
                          {discount.expiry_date ? formatDate(discount.expiry_date) : 'No limit'}
                        </span>
                      ) : (
                        'No time limit'
                      )}
                    </TableCell>
                    <TableCell>
                      {discount.usage_limit ? (
                        <span className="text-sm">
                          {discount.usage_count || 0} / {discount.usage_limit}
                        </span>
                      ) : (
                        'Unlimited'
                      )}
                    </TableCell>
                    <TableCell>
                      {discount.applicable_services && discount.applicable_services.length > 0 ? (
                        <span className="text-sm">
                          {discount.applicable_services.length} services
                        </span>
                      ) : (
                        'All services'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={discount.is_active}
                          onCheckedChange={() => toggleDiscountStatus(discount.id, discount.is_active)}
                        />
                        <span className={discount.is_active ? 'text-green-600' : 'text-red-600'}>
                          {discount.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => toggleDiscountStatus(discount.id, discount.is_active)}
                      >
                        {discount.is_active ? 'Disable' : 'Enable'}
                      </Button>
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

export default DiscountCodes;
