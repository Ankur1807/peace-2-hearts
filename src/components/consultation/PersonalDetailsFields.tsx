
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PersonalDetails } from '@/utils/types';

interface PersonalDetailsFieldsProps {
  personalDetails: PersonalDetails;
  handlePersonalDetailsFieldChange: (field: string, value: string) => void;
}

const PersonalDetailsFields: React.FC<PersonalDetailsFieldsProps> = ({
  personalDetails,
  handlePersonalDetailsFieldChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <Input
            id="firstName"
            value={personalDetails.firstName}
            onChange={(e) => handlePersonalDetailsFieldChange('firstName', e.target.value)}
            className="border-gray-300 focus:border-peacefulBlue"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            value={personalDetails.lastName}
            onChange={(e) => handlePersonalDetailsFieldChange('lastName', e.target.value)}
            className="border-gray-300 focus:border-peacefulBlue"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalDetails.email}
            onChange={(e) => handlePersonalDetailsFieldChange('email', e.target.value)}
            className="border-gray-300 focus:border-peacefulBlue"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={personalDetails.phone}
            onChange={(e) => handlePersonalDetailsFieldChange('phone', e.target.value)}
            className="border-gray-300 focus:border-peacefulBlue"
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">Message (Optional)</Label>
        <Textarea
          id="message"
          value={personalDetails.message}
          onChange={(e) => handlePersonalDetailsFieldChange('message', e.target.value)}
          placeholder="Briefly describe your situation to help our experts prepare for your session..."
          className="min-h-[120px] border-gray-300 focus:border-peacefulBlue"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your privacy is important to us. This information will only be shared with your assigned counselor or legal advisor.
        </p>
      </div>
    </div>
  );
};

export default PersonalDetailsFields;
