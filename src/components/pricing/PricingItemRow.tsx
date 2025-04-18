
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Save, X, Trash2, Loader2 } from 'lucide-react';
import { PricingItem } from '@/utils/pricing/pricingOperations';

interface PricingItemRowProps {
  item: PricingItem;
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

const PricingItemRow: React.FC<PricingItemRowProps> = ({
  item,
  editMode,
  editedPrice,
  setEditedPrice,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
  onDelete,
  disabled = false,
}) => {
  const isEditing = editMode === item.id;
  const isDisabled = disabled || (editMode !== null && !isEditing);
  
  return (
    <TableRow key={item.id} className={isEditing ? 'bg-muted/20' : ''}>
      <TableCell className="font-medium capitalize">
        {item.category.replace('-', ' ')}
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{item.item_id}</TableCell>
      <TableCell className="font-medium">
        {item.type === 'service' ? 'Service' : 'Package'}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            className="w-24"
            min="0"
            autoFocus
            disabled={disabled}
          />
        ) : (
          `₹${item.price.toLocaleString()}`
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={item.is_active}
            onCheckedChange={() => onToggleStatus(item.id, item.is_active)}
            disabled={isDisabled}
          />
          <span className={item.is_active ? 'text-green-600' : 'text-red-600'}>
            {item.is_active ? 'Active' : 'Inactive'}
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
                onClick={() => onSave(item.id)}
                disabled={disabled}
              >
                {disabled ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving</>
                ) : (
                  <><Save className="h-4 w-4 mr-1" /> Save</>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item.id, item.price)}
                disabled={isDisabled}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    disabled={isDisabled}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{item.name}". 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(item.id)}
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

export default PricingItemRow;
