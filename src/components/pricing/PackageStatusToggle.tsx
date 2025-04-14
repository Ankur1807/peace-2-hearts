
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PackageStatusToggleProps {
  isActive: boolean;
  onToggle: () => Promise<void>;
}

const PackageStatusToggle: React.FC<PackageStatusToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isActive}
        onCheckedChange={onToggle}
      />
      <span className={isActive ? 'text-green-600' : 'text-red-600'}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default PackageStatusToggle;
