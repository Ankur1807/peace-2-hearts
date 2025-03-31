
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";

type ServicePricing = {
  id: string;
  service_id: string;
  service_name: string;
  price: number;
  category: string;
  scenario: string;
  is_active: boolean;
  currency: string;
};

const ServicePricingTable = () => {
  const [services, setServices] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Partial<ServicePricing> | null>(null);
  const { toast } = useToast();

  const serviceCategories = [
    { id: "mental-health", name: "Mental Health" },
    { id: "legal-support", name: "Legal Support" }
  ];

  // Map of service IDs and their display names
  const serviceOptions = {
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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_pricing")
        .select("*")
        .order("category", { ascending: true })
        .order("service_name", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: ServicePricing) => {
    setEditingId(service.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (service: ServicePricing) => {
    try {
      const { error } = await supabase
        .from("service_pricing")
        .update({
          price: service.price,
          is_active: service.is_active,
          updated_at: new Date().toISOString(),
        })
        .match({ id: service.id });

      if (error) throw error;

      toast({
        title: "Service updated",
        description: "Service pricing has been updated successfully",
      });

      setEditingId(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service pricing?")) return;

    try {
      const { error } = await supabase
        .from("service_pricing")
        .delete()
        .match({ id });

      if (error) throw error;

      toast({
        title: "Service deleted",
        description: "Service pricing has been deleted successfully",
      });

      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setNewService({
      category: "",
      service_id: "",
      service_name: "",
      price: 0,
      scenario: "regular",
      is_active: true,
      currency: "INR"
    });
  };

  const handleCancelAdd = () => {
    setNewService(null);
  };

  const handleSaveNew = async () => {
    if (!newService || !newService.service_id || !newService.price) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("service_pricing")
        .insert({
          service_id: newService.service_id,
          service_name: newService.service_name || serviceOptions[newService.category as keyof typeof serviceOptions].find(s => s.id === newService.service_id)?.name || "",
          price: newService.price,
          category: newService.category,
          scenario: newService.scenario,
          is_active: newService.is_active,
          currency: newService.currency
        });

      if (error) throw error;

      toast({
        title: "Service added",
        description: "New service pricing has been added successfully",
      });

      setNewService(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setNewService({
      ...newService,
      category,
      service_id: ""
    });
  };

  const handleServiceChange = (serviceId: string) => {
    const category = newService?.category as keyof typeof serviceOptions;
    const selectedService = serviceOptions[category]?.find(s => s.id === serviceId);
    
    setNewService({
      ...newService,
      service_id: serviceId,
      service_name: selectedService?.name || ""
    });
  };

  const updateEditedService = (id: string, field: keyof ServicePricing, value: any) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  if (loading) {
    return <div className="text-center p-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Service Pricing</h2>
        <Button onClick={handleAddNew} className="bg-peacefulBlue hover:bg-peacefulBlue/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      {newService && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Service Pricing</CardTitle>
            <CardDescription>Enter the details for the new service pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newService.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Service</label>
                <Select 
                  value={newService.service_id} 
                  onValueChange={handleServiceChange}
                  disabled={!newService.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {newService.category && serviceOptions[newService.category as keyof typeof serviceOptions]?.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Scenario</label>
                <Select 
                  value={newService.scenario} 
                  onValueChange={val => setNewService({...newService, scenario: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="introductory">Introductory</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input 
                  type="number" 
                  value={newService.price?.toString() || ""} 
                  onChange={e => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select 
                  value={newService.currency} 
                  onValueChange={val => setNewService({...newService, currency: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={newService.is_active ? "active" : "inactive"} 
                  onValueChange={val => setNewService({...newService, is_active: val === "active"})}
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
            <TableHead>Category</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Scenario</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map(service => (
              <TableRow key={service.id}>
                <TableCell>
                  {serviceCategories.find(c => c.id === service.category)?.name || service.category}
                </TableCell>
                <TableCell>{service.service_name}</TableCell>
                <TableCell className="capitalize">{service.scenario}</TableCell>
                <TableCell>
                  {editingId === service.id ? (
                    <Input 
                      type="number" 
                      value={service.price} 
                      onChange={e => updateEditedService(service.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  ) : (
                    `${service.currency} ${service.price}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === service.id ? (
                    <Select 
                      value={service.is_active ? "active" : "inactive"} 
                      onValueChange={val => updateEditedService(service.id, 'is_active', val === "active")}
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
                    <span className={`px-2 py-1 rounded-full text-xs ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === service.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleSave(service)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(service.id)}
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
              <TableCell colSpan={6} className="text-center py-8">
                No service pricing available. Click "Add New Service" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicePricingTable;
