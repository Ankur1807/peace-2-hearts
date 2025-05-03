
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
import { UserPlus } from "lucide-react";

const ConsultantsManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
  
  const handleConsultantAdded = (newConsultant: Consultant) => {
    setConsultants([...consultants, newConsultant]);
    setDialogOpen(false);
    toast({
      title: "Success",
      description: "Consultant added successfully",
    });
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Consultant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
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
      
      <ConsultantList 
        consultants={consultants}
        onConsultantUpdated={handleConsultantUpdated}
      />
    </div>
  );
};

export default ConsultantsManagement;
