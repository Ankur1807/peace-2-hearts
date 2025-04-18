
import React from 'react';
import { ServicePrice } from '@/utils/pricingTypes';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Save, X, Trash2 } from 'lucide-react';

interface ServiceEditRowProps {
  service: ServicePrice;
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
  onEdit: (id: string, currentPrice: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
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
  onDelete,
  disabled = false,
}: ServiceEditRowProps) => {
  const isEditing = editMode === service.id;
  
  return (
    <TableRow>
      <TableCell className="font-medium capitalize">
        {service.category.replace('-', ' ')}
      </TableCell>
      <TableCell>{service.service_name}</TableCell>
      <TableCell>{service.service_id}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            className="w-24"
            min="0"
            autoFocus
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
            disabled={disabled || isEditing}
          />
          <span className={service.is_active ? 'text-green-600' : 'text-red-600'}>
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(service.id, service.price)}
                disabled={disabled}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the service "{service.service_name}". 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(service.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ServiceEditRow;
