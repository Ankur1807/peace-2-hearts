
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X, Toggle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ServicePrice } from '@/utils/pricingTypes';
import { Switch } from '@/components/ui/switch';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface ServiceListProps {
  services: ServicePrice[];
  loading: boolean;
  onEdit: (id: string, currentPrice: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
  isAdmin: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  loading,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
  onDelete,
  editMode,
  editedPrice,
  setEditedPrice,
  isAdmin
}) => {
  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (services.length === 0) {
    return <div className="text-center py-8">No services found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price (INR)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{service.service_name}</TableCell>
            <TableCell className="font-mono text-xs">{service.service_id}</TableCell>
            <TableCell>
              <span className="capitalize">{service.category}</span>
            </TableCell>
            <TableCell>
              {editMode === service.id ? (
                <Input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-24"
                />
              ) : (
                formatPrice(service.price)
              )}
            </TableCell>
            <TableCell>
              {isAdmin ? (
                <Switch
                  checked={service.is_active}
                  onCheckedChange={() => onToggleStatus(service.id, service.is_active)}
                />
              ) : (
                <span className={service.is_active ? "text-green-600" : "text-red-600"}>
                  {service.is_active ? "Active" : "Inactive"}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {editMode === service.id ? (
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={onCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => onSave(service.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : isAdmin ? (
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(service.id, service.price)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span className="text-gray-400">Not available</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceList;
