
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";

type PackagePricing = {
  id: string;
  package_id: string;
  package_name: string;
  price: number;
  services: string[];
  is_active: boolean;
  currency: string;
};

const PackagePricingTable = () => {
  const [packages, setPackages] = useState<PackagePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPackage, setNewPackage] = useState<Partial<PackagePricing> | null>(null);
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

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("package_pricing")
        .select("*")
        .order("package_name", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleEdit = (pkg: PackagePricing) => {
    setEditingId(pkg.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (pkg: PackagePricing) => {
    try {
      const { error } = await supabase
        .from("package_pricing")
        .update({
          price: pkg.price,
          services: pkg.services,
          is_active: pkg.is_active,
          updated_at: new Date().toISOString(),
        })
        .match({ id: pkg.id });

      if (error) throw error;

      toast({
        title: "Package updated",
        description: "Package pricing has been updated successfully",
      });

      setEditingId(null);
      fetchPackages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package pricing?")) return;

    try {
      const { error } = await supabase
        .from("package_pricing")
        .delete()
        .match({ id });

      if (error) throw error;

      toast({
        title: "Package deleted",
        description: "Package pricing has been deleted successfully",
      });

      fetchPackages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setNewPackage({
      package_id: "",
      package_name: "",
      price: 0,
      services: [],
      is_active: true,
      currency: "INR"
    });
  };

  const handleCancelAdd = () => {
    setNewPackage(null);
  };

  const handleSaveNew = async () => {
    if (
      !newPackage || 
      !newPackage.package_id || 
      !newPackage.package_name || 
      !newPackage.price || 
      !newPackage.services?.length
    ) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields and select at least one service",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("package_pricing")
        .insert({
          package_id: newPackage.package_id,
          package_name: newPackage.package_name,
          price: newPackage.price,
          services: newPackage.services,
          is_active: newPackage.is_active,
          currency: newPackage.currency
        });

      if (error) throw error;

      toast({
        title: "Package added",
        description: "New package pricing has been added successfully",
      });

      setNewPackage(null);
      fetchPackages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add package",
        variant: "destructive",
      });
    }
  };

  const toggleServiceSelection = (serviceId: string, isEditing: boolean, pkg?: PackagePricing) => {
    if (isEditing && pkg) {
      // For editing existing package
      if (pkg.services.includes(serviceId)) {
        setPackages(prevPackages => 
          prevPackages.map(p => 
            p.id === pkg.id 
              ? { ...p, services: p.services.filter(s => s !== serviceId) } 
              : p
          )
        );
      } else {
        setPackages(prevPackages => 
          prevPackages.map(p => 
            p.id === pkg.id 
              ? { ...p, services: [...p.services, serviceId] } 
              : p
          )
        );
      }
    } else {
      // For creating new package
      if (newPackage?.services?.includes(serviceId)) {
        setNewPackage({
          ...newPackage,
          services: newPackage.services.filter(s => s !== serviceId)
        });
      } else {
        setNewPackage({
          ...newPackage,
          services: [...(newPackage?.services || []), serviceId]
        });
      }
    }
  };

  const updateEditedPackage = (id: string, field: keyof PackagePricing, value: any) => {
    setPackages(prevPackages => 
      prevPackages.map(pkg => 
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  const getServiceName = (serviceId: string) => {
    return flatServices.find(s => s.id === serviceId)?.name || serviceId;
  };

  if (loading) {
    return <div className="text-center p-8">Loading packages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Package Pricing</h2>
        <Button onClick={handleAddNew} className="bg-peacefulBlue hover:bg-peacefulBlue/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Package
        </Button>
      </div>

      {newPackage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Package</CardTitle>
            <CardDescription>Enter the details for the new package pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Package ID</label>
                <Input 
                  value={newPackage.package_id || ""} 
                  onChange={e => setNewPackage({...newPackage, package_id: e.target.value})}
                  placeholder="e.g., divorce-prevention"
                />
                <p className="text-xs text-gray-500">Unique identifier for the package</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Package Name</label>
                <Input 
                  value={newPackage.package_name || ""} 
                  onChange={e => setNewPackage({...newPackage, package_name: e.target.value})}
                  placeholder="e.g., Divorce Prevention Package"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input 
                  type="number" 
                  value={newPackage.price?.toString() || ""} 
                  onChange={e => setNewPackage({...newPackage, price: parseFloat(e.target.value) || 0})}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select 
                  value={newPackage.currency} 
                  onValueChange={val => setNewPackage({...newPackage, currency: val})}
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
                  value={newPackage.is_active ? "active" : "inactive"} 
                  onValueChange={val => setNewPackage({...newPackage, is_active: val === "active"})}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Included Services</label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Mental Health Services</h4>
                  {allServices["mental-health"].map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`new-${service.id}`} 
                        checked={newPackage.services?.includes(service.id)}
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
                        checked={newPackage.services?.includes(service.id)}
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
            <TableHead>Package ID</TableHead>
            <TableHead>Package Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length > 0 ? (
            packages.map(pkg => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.package_id}</TableCell>
                <TableCell>{pkg.package_name}</TableCell>
                <TableCell>
                  {editingId === pkg.id ? (
                    <Input 
                      type="number" 
                      value={pkg.price} 
                      onChange={e => updateEditedPackage(pkg.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  ) : (
                    `${pkg.currency} ${pkg.price}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === pkg.id ? (
                    <div className="space-y-2 max-h-60 overflow-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h4 className="font-medium text-xs mb-2">Mental Health</h4>
                          {allServices["mental-health"].map(service => (
                            <div key={service.id} className="flex items-center space-x-2 mb-1">
                              <Checkbox 
                                id={`edit-${pkg.id}-${service.id}`} 
                                checked={pkg.services.includes(service.id)}
                                onCheckedChange={() => toggleServiceSelection(service.id, true, pkg)}
                              />
                              <label htmlFor={`edit-${pkg.id}-${service.id}`} className="text-xs">
                                {service.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-medium text-xs mb-2">Legal Support</h4>
                          {allServices["legal-support"].map(service => (
                            <div key={service.id} className="flex items-center space-x-2 mb-1">
                              <Checkbox 
                                id={`edit-${pkg.id}-${service.id}`} 
                                checked={pkg.services.includes(service.id)}
                                onCheckedChange={() => toggleServiceSelection(service.id, true, pkg)}
                              />
                              <label htmlFor={`edit-${pkg.id}-${service.id}`} className="text-xs">
                                {service.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      {pkg.services.length > 0 ? (
                        <ul className="list-disc ml-4 text-sm">
                          {pkg.services.slice(0, 3).map(serviceId => (
                            <li key={serviceId}>{getServiceName(serviceId)}</li>
                          ))}
                          {pkg.services.length > 3 && (
                            <li className="text-gray-500">+{pkg.services.length - 3} more</li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No services</span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === pkg.id ? (
                    <Select 
                      value={pkg.is_active ? "active" : "inactive"} 
                      onValueChange={val => updateEditedPackage(pkg.id, 'is_active', val === "active")}
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
                    <span className={`px-2 py-1 rounded-full text-xs ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === pkg.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleSave(pkg)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(pkg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(pkg.id)}
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
                No package pricing available. Click "Add New Package" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackagePricingTable;
