
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';
import { PackagePrice } from '@/utils/pricingTypes';

interface PackageEditFormProps {
  pkg: PackagePrice;
  onSave: (price: number) => Promise<void>;
}

const PackageEditForm: React.FC<PackageEditFormProps> = ({ pkg, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedPrice, setEditedPrice] = useState(pkg.price.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const price = Number(editedPrice);
    if (!isNaN(price) && price > 0) {
      try {
        setIsSaving(true);
        await onSave(price);
        setEditMode(false);
      } catch (error) {
        console.error('Error saving price:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedPrice(pkg.price.toString());
  };

  if (!editMode) {
    return (
      <div className="flex items-center space-x-2">
        <span>₹{pkg.price.toLocaleString()}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditMode(true)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        value={editedPrice}
        onChange={(e) => setEditedPrice(e.target.value)}
        className="w-24"
        min="0"
      />
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default PackageEditForm;
