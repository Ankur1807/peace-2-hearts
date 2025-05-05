
import React, { useEffect } from 'react';
import { usePricingServices } from '@/hooks/usePricingServices';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { Check, X, Pencil, Save } from 'lucide-react';

const AdminPricing: React.FC = () => {
  const {
    services,
    loading,
    fetchServices,
    editMode,
    editedPrice,
    setEditedPrice,
    handleEdit,
    handleCancel,
    handleSave,
  } = usePricingServices();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Pricing Management</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => fetchServices()}
              disabled={loading}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md"/>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (INR)</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No services available. Services will appear here once added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service) => (
                      <TableRow key={service.id} className={!service.is_active ? "opacity-50" : ""}>
                        <TableCell className="font-mono text-xs">{service.service_id}</TableCell>
                        <TableCell>{service.service_name}</TableCell>
                        <TableCell className="capitalize">{service.category}</TableCell>
                        <TableCell>
                          {editMode === service.id ? (
                            <Input
                              type="number"
                              value={editedPrice}
                              onChange={(e) => setEditedPrice(e.target.value)}
                              className="w-32"
                              autoFocus
                            />
                          ) : (
                            formatPrice(service.price)
                          )}
                        </TableCell>
                        <TableCell>
                          {editMode === service.id ? (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSave(service.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(service.id, service.price)}
                              className="h-8 w-8 p-0"
                              disabled={editMode !== null}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
