
import React from 'react';
import { PricingItem } from '@/utils/pricing/pricingOperations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PricingItemRow from './PricingItemRow';
import { Loader2 } from 'lucide-react';

interface PricingItemsListProps {
  items: PricingItem[];
  loading: boolean;
  updating: boolean;
  onEdit: (id: string, currentPrice: number) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  editMode: string | null;
  editedPrice: string;
  setEditedPrice: (price: string) => void;
}

const PricingItemsList: React.FC<PricingItemsListProps> = ({
  items,
  loading,
  updating,
  onEdit,
  onSave,
  onCancel,
  onToggleStatus,
  onDelete,
  editMode,
  editedPrice,
  setEditedPrice,
}) => {
  return (
    <div className="overflow-x-auto relative">
      {updating && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="flex flex-col items-center bg-white p-4 rounded-md shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm font-medium">Updating...</p>
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Item ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span>Loading items...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No items found. Click "Add Item" to create new pricing items.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <PricingItemRow
                key={item.id}
                item={item}
                editMode={editMode}
                editedPrice={editedPrice}
                setEditedPrice={setEditedPrice}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                disabled={updating}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingItemsList;
