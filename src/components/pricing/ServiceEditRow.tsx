
import React from 'react';
import { ServicePrice } from '@/utils/pricingTypes';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X } from 'lucide-react';

interface ServiceEditRowProps {
  service: ServicePrice;
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
  onEdit: (id: string, currentPrice: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

const ServiceEditRow = ({
  service,
  editMode,
  editedPrice,
  setEditedPrice,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
}: ServiceEditRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium capitalize">
        {service.category.replace('-', ' ')}
      </TableCell>
      <TableCell>{service.service_name}</TableCell>
      <TableCell>{service.service_id}</TableCell>
      <TableCell>
        {editMode === service.id ? (
          <Input
            type="number"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            className="w-24"
            min="0"
          />
        ) : (
          `₹${service.price.toLocaleString()}`
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={service.is_active}
            onCheckedChange={() => onToggleStatus(service.id, service.is_active)}
          />
          <span className={service.is_active ? 'text-green-600' : 'text-red-600'}>
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {editMode === service.id ? (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave(service.id)}
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(service.id, service.price)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ServiceEditRow;
