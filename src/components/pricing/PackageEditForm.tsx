
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';
import { ServicePrice } from '@/utils/pricingTypes';

interface PackageEditFormProps {
  pkg: ServicePrice;
  onSave: (price: number) => Promise<void>;
  disabled?: boolean;
}

const PackageEditForm: React.FC<PackageEditFormProps> = ({ pkg, onSave, disabled = false }) => {
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
          disabled={disabled}
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
        disabled={isSaving || disabled}
      />
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || disabled}
        >
          <Save className="h-4 w-4 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving || disabled}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default PackageEditForm;
