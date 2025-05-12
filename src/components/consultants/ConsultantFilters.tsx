
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SortAsc, SortDesc } from "lucide-react";

interface ConsultantFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  specialization: string;
  setSpecialization: (specialization: string) => void;
  availability: string;
  setAvailability: (availability: string) => void;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  handleReset: () => void;
  onRefresh: () => void;
  specializations: string[];
}

const ConsultantFilters: React.FC<ConsultantFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  specialization,
  setSpecialization,
  availability,
  setAvailability,
  sortOrder,
  toggleSortOrder,
  handleReset,
  onRefresh,
  specializations,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Search by name or specialization"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <Select value={specialization} onValueChange={setSpecialization}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specializations</SelectItem>
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec || ""}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Availability</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? (
              <>
                <SortAsc className="h-4 w-4" />
                A-Z
              </>
            ) : (
              <>
                <SortDesc className="h-4 w-4" />
                Z-A
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantFilters;
