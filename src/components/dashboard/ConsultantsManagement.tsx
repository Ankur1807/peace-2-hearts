
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Consultant } from "@/utils/consultants";
import DashboardLoader from "./DashboardLoader";
import ConsultantList from "@/components/consultants/ConsultantList";
import AuthWrapper from "@/components/consultants/AuthWrapper";
import ConsultantFilters from "@/components/consultants/ConsultantFilters";
import AdminHeader from "@/components/consultants/AdminHeader";

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

  const handleSignOut = () => {
    localStorage.removeItem('p2h_admin_authenticated');
    setIsAuthenticated(false);
  };

  // Extract unique specializations for filter dropdown
  const specializations = Array.from(
    new Set(consultants.map(c => c.specialization).filter(Boolean))
  );

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <div className="space-y-4">
      <AuthWrapper 
        isAuthenticated={isAuthenticated} 
        onAuthenticated={handleAuthenticated}
      >
        <AdminHeader 
          onConsultantAdded={handleConsultantAdded}
          onSignOut={handleSignOut}
          title="Manage Consultants"
        />
        
        <ConsultantFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          specialization={specialization}
          setSpecialization={setSpecialization}
          availability={availability}
          setAvailability={setAvailability}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          handleReset={handleReset}
          onRefresh={onRefresh}
          specializations={specializations}
        />
        
        <ConsultantList 
          consultants={filteredConsultants}
          onConsultantUpdated={onConsultantUpdated}
        />
      </AuthWrapper>
    </div>
  );
};

export default ConsultantsManagement;
