
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Consultant, getConsultants } from "@/utils/consultants";
import DashboardLoader from "./DashboardLoader";
import ConsultantList from "@/components/consultants/ConsultantList";
import AdminAuth from "@/components/consultants/AdminAuth";

const ConsultantsManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
    setIsAuthenticated(adminAuthenticated);
    
    if (adminAuthenticated) {
      fetchConsultants();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const data = await getConsultants();
      setConsultants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load consultants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsultantUpdated = (updatedConsultant: Consultant) => {
    setConsultants(
      consultants.map(c => 
        c.id === updatedConsultant.id ? updatedConsultant : c
      )
    );
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    fetchConsultants();
  };

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
          <Button variant="default" asChild>
            <Link to="/add-consultant">Add Consultant</Link>
          </Button>
        </div>
      </div>
      
      <ConsultantList 
        consultants={consultants}
        onConsultantUpdated={handleConsultantUpdated}
      />
    </div>
  );
};

export default ConsultantsManagement;
