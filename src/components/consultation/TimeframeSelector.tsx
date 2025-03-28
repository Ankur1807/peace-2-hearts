
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TimeframeSelectorProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  timeframe,
  setTimeframe
}) => {
  return (
    <div className="space-y-2">
      <Label>How soon do you want the sessions done?</Label>
      <RadioGroup value={timeframe} onValueChange={setTimeframe} className="space-y-2 pt-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1-2-weeks" id="1-2-weeks" />
          <Label htmlFor="1-2-weeks" className="cursor-pointer">1-2 weeks</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2-4-weeks" id="2-4-weeks" />
          <Label htmlFor="2-4-weeks" className="cursor-pointer">2-4 weeks</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4-weeks-plus" id="4-weeks-plus" />
          <Label htmlFor="4-weeks-plus" className="cursor-pointer">4 weeks+</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TimeframeSelector;
