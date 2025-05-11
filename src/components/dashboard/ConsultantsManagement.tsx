
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Consultant, getConsultants } from "@/utils/consultants";
import DashboardLoader from "./DashboardLoader";
import ConsultantList from "@/components/consultants/ConsultantList";
import AdminAuth from "@/components/consultants/AdminAuth";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Filter, Search, SortDesc, SortAsc } from "lucide-react";

interface ConsultantsManagementProps {
  consultants: Consultant[];
  loading?: boolean;
  onConsultantUpdated: (updatedConsultant: Consultant) => void;
  onRefresh: () => void;
}

const ConsultantsManagement = ({ 
  consultants, 
  loading = false,
  onConsultantUpdated,
  onRefresh 
}: ConsultantsManagementProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
    setIsAuthenticated(adminAuthenticated);
  }, []);

  useEffect(() => {
    // Apply filters and sorting to consultants
    let filtered = [...consultants];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name?.toLowerCase().includes(query) || false) ||
        (c.specialization?.toLowerCase().includes(query) || false)
      );
    }
    
    // Filter by specialization
    if (specialization) {
      filtered = filtered.filter(c => c.specialization === specialization);
    }
    
    // Filter by availability
    if (availability === "available") {
      filtered = filtered.filter(c => c.is_available);
    } else if (availability === "unavailable") {
      filtered = filtered.filter(c => !c.is_available);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    
    setFilteredConsultants(filtered);
  }, [consultants, searchQuery, specialization, availability, sortOrder]);
  
  const handleConsultantAdded = (newConsultant: Consultant) => {
    onConsultantUpdated(newConsultant);
    setDialogOpen(false);
    toast({
      title: "Success",
      description: "Consultant added successfully",
    });
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleReset = () => {
    setSearchQuery("");
    setSpecialization("");
    setAvailability("");
    setSortOrder("asc");
  };

  // Extract unique specializations for filter dropdown
  const specializations = Array.from(
    new Set(consultants.map(c => c.specialization).filter(Boolean))
  );

  if (loading) {
    return <DashboardLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <AdminAuth onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Consultants</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('p2h_admin_authenticated');
              setIsAuthenticated(false);
            }}
          >
            Sign Out
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Consultant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Consultant</DialogTitle>
              </DialogHeader>
              <ConsultantForm 
                onSuccess={handleConsultantAdded}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
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
      
      <ConsultantList 
        consultants={filteredConsultants}
        onConsultantUpdated={onConsultantUpdated}
      />
    </div>
  );
};

export default ConsultantsManagement;
