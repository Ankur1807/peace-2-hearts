
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Pencil, PlusCircle, Trash2, TagIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/utils/pricing/fetchPricing';

const DiscountCodes = () => {
  const { 
    discountCodes, 
    loading, 
    fetchDiscountCodes, 
    addDiscountCode, 
    updateDiscountCode,
    toggleDiscountStatus,
    deleteDiscountCode
  } = useDiscountCodes();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  // New code form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    description: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    expiryDate: '',
    applicableServices: [] as string[]
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    id: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    description: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    expiryDate: '',
    isActive: true,
    applicableServices: [] as string[]
  });

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    if (isEditDialogOpen) {
      setEditFormData({
        ...editFormData,
        [fieldName]: value
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: value
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      description: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      expiryDate: '',
      applicableServices: []
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDiscountCode({
        code: formData.code,
        discount_type: formData.discountType,
        discount_value: Number(formData.discountValue),
        description: formData.description || null,
        min_purchase_amount: formData.minPurchaseAmount ? Number(formData.minPurchaseAmount) : null,
        max_discount_amount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        start_date: formData.startDate || null,
        expiry_date: formData.expiryDate || null,
        applicable_services: formData.applicableServices.length > 0 ? formData.applicableServices : null
      });

      toast({
        title: "Success",
        description: "Discount code has been added successfully",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add discount code",
        variant: "destructive"
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscountCode(editFormData.id, {
        code: editFormData.code,
        discount_type: editFormData.discountType,
        discount_value: Number(editFormData.discountValue),
        description: editFormData.description || null,
        min_purchase_amount: editFormData.minPurchaseAmount ? Number(editFormData.minPurchaseAmount) : null,
        max_discount_amount: editFormData.maxDiscountAmount ? Number(editFormData.maxDiscountAmount) : null,
        start_date: editFormData.startDate || null,
        expiry_date: editFormData.expiryDate || null,
        is_active: editFormData.isActive,
        applicable_services: editFormData.applicableServices.length > 0 ? editFormData.applicableServices : null
      });

      toast({
        title: "Success",
        description: "Discount code has been updated successfully",
      });
      
      setIsEditDialogOpen(false);
      setEditingCode(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update discount code",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleDiscountStatus(id, currentStatus);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount code?")) {
      try {
        await deleteDiscountCode(id);
        toast({
          title: "Success",
          description: "Discount code has been deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete discount code",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditCode = (code: any) => {
    setEditFormData({
      id: code.id,
      code: code.code,
      discountType: code.discount_type,
      discountValue: code.discount_value.toString(),
      description: code.description || '',
      minPurchaseAmount: code.min_purchase_amount ? code.min_purchase_amount.toString() : '',
      maxDiscountAmount: code.max_discount_amount ? code.max_discount_amount.toString() : '',
      startDate: code.start_date ? new Date(code.start_date).toISOString().slice(0, 10) : '',
      expiryDate: code.expiry_date ? new Date(code.expiry_date).toISOString().slice(0, 10) : '',
      isActive: code.is_active,
      applicableServices: code.applicable_services || []
    });
    setEditingCode(code.id);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeClass = (code: any) => {
    if (!code.is_active) return "bg-gray-400";
    
    const now = new Date();
    const expiry = code.expiry_date ? new Date(code.expiry_date) : null;
    const start = code.start_date ? new Date(code.start_date) : null;
    
    if (expiry && expiry < now) return "bg-red-500";
    if (start && start > now) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStatusLabel = (code: any) => {
    if (!code.is_active) return "Inactive";
    
    const now = new Date();
    const expiry = code.expiry_date ? new Date(code.expiry_date) : null;
    const start = code.start_date ? new Date(code.start_date) : null;
    
    if (expiry && expiry < now) return "Expired";
    if (start && start > now) return "Scheduled";
    return "Active";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Discount Codes</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Discount Code</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Discount Code</DialogTitle>
              <DialogDescription>Add a new discount code for services or packages.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">Code</Label>
                  <Input 
                    id="code" 
                    name="code" 
                    placeholder="WELCOME10" 
                    value={formData.code}
                    onChange={handleFormChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discountType" className="text-right">Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange(value, 'discountType')}
                    defaultValue={formData.discountType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discountValue" className="text-right">Value</Label>
                  <Input 
                    id="discountValue" 
                    name="discountValue" 
                    type="number" 
                    placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                    value={formData.discountValue}
                    onChange={handleFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input 
                    id="description" 
                    name="description"
                    placeholder="Welcome discount for new customers"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minPurchaseAmount" className="text-right">Min Purchase</Label>
                  <Input 
                    id="minPurchaseAmount" 
                    name="minPurchaseAmount"
                    type="number"
                    placeholder="1000"
                    value={formData.minPurchaseAmount}
                    onChange={handleFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxDiscountAmount" className="text-right">Max Discount</Label>
                  <Input 
                    id="maxDiscountAmount" 
                    name="maxDiscountAmount"
                    type="number"
                    placeholder="1000"
                    value={formData.maxDiscountAmount}
                    onChange={handleFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleFormChange}
                    className="col-span-3" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Discount</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Discount Code</DialogTitle>
              <DialogDescription>Update the discount code details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">Code</Label>
                  <Input 
                    id="edit-code" 
                    name="code" 
                    value={editFormData.code}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-discountType" className="text-right">Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange(value, 'discountType')}
                    defaultValue={editFormData.discountType}
                    value={editFormData.discountType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-discountValue" className="text-right">Value</Label>
                  <Input 
                    id="edit-discountValue" 
                    name="discountValue" 
                    type="number" 
                    value={editFormData.discountValue}
                    onChange={handleEditFormChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Input 
                    id="edit-description" 
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-minPurchaseAmount" className="text-right">Min Purchase</Label>
                  <Input 
                    id="edit-minPurchaseAmount" 
                    name="minPurchaseAmount"
                    type="number"
                    value={editFormData.minPurchaseAmount}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-maxDiscountAmount" className="text-right">Max Discount</Label>
                  <Input 
                    id="edit-maxDiscountAmount" 
                    name="maxDiscountAmount"
                    type="number"
                    value={editFormData.maxDiscountAmount}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startDate" className="text-right">Start Date</Label>
                  <Input 
                    id="edit-startDate" 
                    name="startDate"
                    type="date"
                    value={editFormData.startDate}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-expiryDate" className="text-right">Expiry Date</Label>
                  <Input 
                    id="edit-expiryDate" 
                    name="expiryDate"
                    type="date"
                    value={editFormData.expiryDate}
                    onChange={handleEditFormChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isActive" className="text-right">Active</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch 
                      id="edit-isActive" 
                      checked={editFormData.isActive} 
                      onCheckedChange={(checked) => setEditFormData({...editFormData, isActive: checked})}
                    />
                    <Label htmlFor="edit-isActive">{editFormData.isActive ? 'Active' : 'Inactive'}</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Discount</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : discountCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <TagIcon className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <p>No discount codes found. Create your first discount code to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discountCodes.map((code) => (
              <div key={code.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{code.code}</span>
                    <Badge className={getStatusBadgeClass(code)}>{getStatusLabel(code)}</Badge>
                    {code.discount_type === 'percentage' ? (
                      <Badge variant="outline">{code.discount_value}% off</Badge>
                    ) : (
                      <Badge variant="outline">{formatPrice(code.discount_value)} off</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditCode(code)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteCode(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mt-1">{code.description || "No description"}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="font-medium">Valid from:</span> {formatDate(code.start_date)}
                  </div>
                  <div>
                    <span className="font-medium">Expires on:</span> {formatDate(code.expiry_date)}
                  </div>
                  
                  {code.min_purchase_amount && (
                    <div>
                      <span className="font-medium">Minimum purchase:</span> {formatPrice(code.min_purchase_amount)}
                    </div>
                  )}
                  
                  {code.max_discount_amount && (
                    <div>
                      <span className="font-medium">Maximum discount:</span> {formatPrice(code.max_discount_amount)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Used {code.usage_count || 0} times</span>
                    {code.usage_limit && (
                      <span className="text-muted-foreground"> (Limit: {code.usage_limit})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{code.is_active ? 'Active' : 'Inactive'}</span>
                    <Switch 
                      checked={code.is_active} 
                      onCheckedChange={() => handleToggleStatus(code.id, code.is_active)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountCodes;
