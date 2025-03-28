
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input 
            id="first-name" 
            value={personalDetails.firstName}
            onChange={(e) => handlePersonalDetailsFieldChange('firstName', e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input 
            id="last-name" 
            value={personalDetails.lastName}
            onChange={(e) => handlePersonalDetailsFieldChange('lastName', e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={personalDetails.email}
          onChange={(e) => handlePersonalDetailsFieldChange('email', e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={personalDetails.phone}
          onChange={(e) => handlePersonalDetailsFieldChange('phone', e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Brief Description (Optional)</Label>
        <Textarea 
          id="message" 
          placeholder="Please provide a brief overview of your situation to help us prepare for your consultation."
          rows={4}
          value={personalDetails.message}
          onChange={(e) => handlePersonalDetailsFieldChange('message', e.target.value)}
        />
      </div>
    </>
  );
};

export default PersonalDetailsFields;
