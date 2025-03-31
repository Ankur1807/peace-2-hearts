
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Pencil, Trash, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DiscountCode = {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  is_active: boolean;
  start_date: string | null;
  expiry_date: string | null;
  usage_limit: number | null;
  usage_count: number | null;
  applicable_services: string[] | null;
  created_at: string;
  updated_at: string;
};

const DiscountCodesTable = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode> | null>(null);
  const { toast } = useToast();

  // All available services, grouped by category
  const allServices = {
    "mental-health": [
      { id: "mental-health-counselling", name: "Mental Health Counselling" },
      { id: "family-therapy", name: "Family Therapy" },
      { id: "premarital-counselling", name: "Premarital Counselling" },
      { id: "couples-counselling", name: "Couples Counselling" },
      { id: "sexual-health-counselling", name: "Sexual Health Counselling" }
    ],
    "legal-support": [
      { id: "pre-marriage-legal", name: "Pre-Marriage Legal" },
      { id: "mediation", name: "Mediation Services" },
      { id: "divorce", name: "Divorce Consultation" },
      { id: "custody", name: "Child Custody Consultation" },
      { id: "maintenance", name: "Maintenance Consultation" },
      { id: "general-legal", name: "General Legal Consultation" }
    ]
  };

  // Combine all services into a single array for easier lookup
  const flatServices = Object.values(allServices).flat();

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDiscountCodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load discount codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const handleEdit = (discount: DiscountCode) => {
    setEditingId(discount.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (discount: DiscountCode) => {
    try {
      const { error } = await supabase
        .from("discount_codes")
        .update({
          code: discount.code,
          description: discount.description,
          discount_type: discount.discount_type,
          discount_value: discount.discount_value,
          min_purchase_amount: discount.min_purchase_amount,
          max_discount_amount: discount.max_discount_amount,
          is_active: discount.is_active,
          start_date: discount.start_date,
          expiry_date: discount.expiry_date,
          usage_limit: discount.usage_limit,
          applicable_services: discount.applicable_services,
          updated_at: new Date().toISOString(),
        })
        .match({ id: discount.id });

      if (error) throw error;

      toast({
        title: "Discount code updated",
        description: "Discount code has been updated successfully",
      });

      setEditingId(null);
      fetchDiscountCodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update discount code",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;

    try {
      const { error } = await supabase
        .from("discount_codes")
        .delete()
        .match({ id });

      if (error) throw error;

      toast({
        title: "Discount code deleted",
        description: "Discount code has been deleted successfully",
      });

      fetchDiscountCodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete discount code",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setNewDiscount({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_purchase_amount: 0,
      max_discount_amount: null,
      is_active: true,
      start_date: null,
      expiry_date: null,
      usage_limit: null,
      usage_count: 0,
      applicable_services: null,
    });
  };

  const handleCancelAdd = () => {
    setNewDiscount(null);
  };

  const handleSaveNew = async () => {
    if (
      !newDiscount || 
      !newDiscount.code || 
      !newDiscount.discount_type || 
      !newDiscount.discount_value
    ) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("discount_codes")
        .insert({
          code: newDiscount.code,
          description: newDiscount.description,
          discount_type: newDiscount.discount_type,
          discount_value: newDiscount.discount_value,
          min_purchase_amount: newDiscount.min_purchase_amount,
          max_discount_amount: newDiscount.max_discount_amount,
          is_active: newDiscount.is_active,
          start_date: newDiscount.start_date,
          expiry_date: newDiscount.expiry_date,
          usage_limit: newDiscount.usage_limit,
          applicable_services: newDiscount.applicable_services,
        });

      if (error) throw error;

      toast({
        title: "Discount code added",
        description: "New discount code has been added successfully",
      });

      setNewDiscount(null);
      fetchDiscountCodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add discount code",
        variant: "destructive",
      });
    }
  };

  const toggleServiceSelection = (serviceId: string, isEditing: boolean, discount?: DiscountCode) => {
    if (isEditing && discount) {
      // For editing existing discount
      const currentServices = discount.applicable_services || [];
      
      if (currentServices.includes(serviceId)) {
        setDiscountCodes(prevDiscounts => 
          prevDiscounts.map(d => 
            d.id === discount.id 
              ? { ...d, applicable_services: currentServices.filter(s => s !== serviceId) } 
              : d
          )
        );
      } else {
        setDiscountCodes(prevDiscounts => 
          prevDiscounts.map(d => 
            d.id === discount.id 
              ? { ...d, applicable_services: [...currentServices, serviceId] } 
              : d
          )
        );
      }
    } else {
      // For creating new discount
      const currentServices = newDiscount?.applicable_services || [];
      
      if (currentServices.includes(serviceId)) {
        setNewDiscount({
          ...newDiscount,
          applicable_services: currentServices.filter(s => s !== serviceId)
        });
      } else {
        setNewDiscount({
          ...newDiscount,
          applicable_services: [...currentServices, serviceId]
        });
      }
    }
  };

  const updateEditedDiscount = (id: string, field: keyof DiscountCode, value: any) => {
    setDiscountCodes(prevDiscounts => 
      prevDiscounts.map(discount => 
        discount.id === id ? { ...discount, [field]: value } : discount
      )
    );
  };

  const getServiceName = (serviceId: string) => {
    return flatServices.find(s => s.id === serviceId)?.name || serviceId;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return format(new Date(date), "PPP");
  };

  if (loading) {
    return <div className="text-center p-8">Loading discount codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Discount Codes</h2>
        <Button onClick={handleAddNew} className="bg-peacefulBlue hover:bg-peacefulBlue/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Discount Code
        </Button>
      </div>

      {newDiscount && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Discount Code</CardTitle>
            <CardDescription>Enter the details for the new discount code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input 
                  value={newDiscount.code || ""} 
                  onChange={e => setNewDiscount({...newDiscount, code: e.target.value})}
                  placeholder="e.g., SUMMER20"
                  className="uppercase"
                />
                <p className="text-xs text-gray-500">Unique code customers will enter</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Type</label>
                <Select 
                  value={newDiscount.discount_type} 
                  onValueChange={val => setNewDiscount({...newDiscount, discount_type: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Value</label>
                <Input 
                  type="number" 
                  value={newDiscount.discount_value?.toString() || ""} 
                  onChange={e => setNewDiscount({...newDiscount, discount_value: parseFloat(e.target.value) || 0})}
                  placeholder={newDiscount.discount_type === "percentage" ? "e.g., 20 (for 20%)" : "e.g., 500"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Purchase Amount</label>
                <Input 
                  type="number" 
                  value={newDiscount.min_purchase_amount?.toString() || "0"} 
                  onChange={e => setNewDiscount({...newDiscount, min_purchase_amount: parseFloat(e.target.value) || 0})}
                  placeholder="e.g., 1000"
                />
                <p className="text-xs text-gray-500">Minimum order value to apply this discount</p>
              </div>

              {newDiscount.discount_type === "percentage" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Discount Amount</label>
                  <Input 
                    type="number" 
                    value={newDiscount.max_discount_amount?.toString() || ""} 
                    onChange={e => {
                      const value = e.target.value ? parseFloat(e.target.value) : null;
                      setNewDiscount({...newDiscount, max_discount_amount: value});
                    }}
                    placeholder="e.g., 2000 (optional)"
                  />
                  <p className="text-xs text-gray-500">Maximum amount of discount allowed</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Limit</label>
                <Input 
                  type="number" 
                  value={newDiscount.usage_limit?.toString() || ""} 
                  onChange={e => {
                    const value = e.target.value ? parseInt(e.target.value) : null;
                    setNewDiscount({...newDiscount, usage_limit: value});
                  }}
                  placeholder="Leave blank for unlimited uses"
                />
                <p className="text-xs text-gray-500">How many times this code can be used</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDiscount.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDiscount.start_date ? format(new Date(newDiscount.start_date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDiscount.start_date ? new Date(newDiscount.start_date) : undefined}
                      onSelect={(date) => setNewDiscount({...newDiscount, start_date: date ? date.toISOString() : null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newDiscount.expiry_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDiscount.expiry_date ? format(new Date(newDiscount.expiry_date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newDiscount.expiry_date ? new Date(newDiscount.expiry_date) : undefined}
                      onSelect={(date) => setNewDiscount({...newDiscount, expiry_date: date ? date.toISOString() : null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={newDiscount.is_active ? "active" : "inactive"} 
                  onValueChange={val => setNewDiscount({...newDiscount, is_active: val === "active"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={newDiscount.description || ""} 
                  onChange={e => setNewDiscount({...newDiscount, description: e.target.value})}
                  placeholder="Description of the discount for internal reference"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <span>Applicable Services</span>
                <span className="ml-2 text-xs text-gray-500">(Leave empty to apply to all services)</span>
              </label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Mental Health Services</h4>
                  {allServices["mental-health"].map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`new-${service.id}`} 
                        checked={newDiscount.applicable_services?.includes(service.id)}
                        onCheckedChange={() => toggleServiceSelection(service.id, false)}
                      />
                      <label htmlFor={`new-${service.id}`} className="text-sm">
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Legal Support Services</h4>
                  {allServices["legal-support"].map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`new-${service.id}`} 
                        checked={newDiscount.applicable_services?.includes(service.id)}
                        onCheckedChange={() => toggleServiceSelection(service.id, false)}
                      />
                      <label htmlFor={`new-${service.id}`} className="text-sm">
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelAdd}>
              Cancel
            </Button>
            <Button onClick={handleSaveNew} className="bg-peacefulBlue hover:bg-peacefulBlue/90">
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discountCodes.length > 0 ? (
            discountCodes.map(discount => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium uppercase">{discount.code}</TableCell>
                <TableCell className="capitalize">
                  {discount.discount_type === "percentage" ? "Percentage" : "Fixed Amount"}
                </TableCell>
                <TableCell>
                  {editingId === discount.id ? (
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="number" 
                        value={discount.discount_value} 
                        onChange={e => updateEditedDiscount(discount.id, 'discount_value', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span>{discount.discount_type === "percentage" ? "%" : "₹"}</span>
                    </div>
                  ) : (
                    <span>
                      {discount.discount_value}{discount.discount_type === "percentage" ? "%" : "₹"}
                      {discount.discount_type === "percentage" && discount.max_discount_amount && 
                        ` (max: ₹${discount.max_discount_amount})`}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === discount.id ? (
                    <Select 
                      value={discount.is_active ? "active" : "inactive"} 
                      onValueChange={val => updateEditedDiscount(discount.id, 'is_active', val === "active")}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${discount.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === discount.id ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[180px] pl-3 text-left font-normal",
                            !discount.expiry_date && "text-muted-foreground"
                          )}
                        >
                          {discount.expiry_date ? format(new Date(discount.expiry_date), "PPP") : "No expiry"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={discount.expiry_date ? new Date(discount.expiry_date) : undefined}
                          onSelect={(date) => updateEditedDiscount(
                            discount.id, 
                            'expiry_date', 
                            date ? date.toISOString() : null
                          )}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    formatDate(discount.expiry_date)
                  )}
                </TableCell>
                <TableCell>
                  {discount.usage_count || 0} 
                  {discount.usage_limit && ` / ${discount.usage_limit}`}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === discount.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleSave(discount)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(discount)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(discount.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No discount codes available. Click "Add New Discount Code" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DiscountCodesTable;
