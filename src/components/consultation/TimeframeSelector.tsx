
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
      <Label htmlFor="timeframe-select">How soon do you want the sessions done?</Label>
      <Select value={timeframe} onValueChange={setTimeframe}>
        <SelectTrigger id="timeframe-select" className="w-full">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
          <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
          <SelectItem value="4-weeks-plus">4 weeks+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeframeSelector;
