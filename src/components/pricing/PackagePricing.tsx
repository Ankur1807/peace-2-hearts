
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { PackagePrice } from '@/utils/pricingTypes';

const PackagePricing = () => {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('package_pricing')
        .select('*')
        .order('package_name', { ascending: true });

      if (error) throw error;
      setPackages(data as PackagePrice[] || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch packages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
        .from('package_pricing')
        .update({ price: Number(editedPrice), updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Price Updated',
        description: 'Package price has been successfully updated.',
      });

      setEditMode(null);
      fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update price: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const togglePackageStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('package_pricing')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Package ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Package ID</TableHead>
                <TableHead>Included Services</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading packages...
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No packages found
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.package_name}</TableCell>
                    <TableCell>{pkg.package_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pkg.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editMode === pkg.id ? (
                        <Input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="w-24"
                          min="0"
                        />
                      ) : (
                        `₹${pkg.price.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={pkg.is_active}
                          onCheckedChange={() => togglePackageStatus(pkg.id, pkg.is_active)}
                        />
                        <span className={pkg.is_active ? 'text-green-600' : 'text-red-600'}>
                          {pkg.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editMode === pkg.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave(pkg.id)}
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
                          onClick={() => handleEdit(pkg.id, pkg.price)}
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

export default PackagePricing;
