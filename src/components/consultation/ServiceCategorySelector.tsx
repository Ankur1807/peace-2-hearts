
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServiceCategorySelectorProps {
  serviceCategory: string;
  setServiceCategory: (value: string) => void;
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  serviceCategory,
  setServiceCategory
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="service-category">Service Category</Label>
      <Select value={serviceCategory} onValueChange={setServiceCategory}>
        <SelectTrigger id="service-category">
          <SelectValue placeholder="Select service category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="holistic">Holistic Solutions</SelectItem>
          <SelectItem value="mental-health">Mental Health</SelectItem>
          <SelectItem value="legal">Legal Services</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceCategorySelector;
