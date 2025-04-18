
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PackageStatusToggleProps {
  isActive: boolean;
  onChange: () => Promise<void>;
  disabled?: boolean;
}

const PackageStatusToggle: React.FC<PackageStatusToggleProps> = ({
  isActive,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isActive}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <span className={isActive ? 'text-green-600' : 'text-red-600'}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default PackageStatusToggle;
