
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingsFilterProps {
  statusFilter: string;
  searchQuery: string;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export const BookingsFilter = ({ 
  statusFilter, 
  searchQuery, 
  onStatusChange, 
  onSearchChange 
}: BookingsFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, email, or reference ID"
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select
            value={statusFilter}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
