
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Consultant, getConsultants } from "@/utils/consultantApi";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import ConsultantList from "@/components/consultants/ConsultantList";
import ConsultantLoader from "@/components/consultants/ConsultantLoader";
import AdminAuth from "@/components/consultants/AdminAuth";

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleConsultantAdded = (newConsultant: Consultant) => {
    setConsultants([...consultants, newConsultant]);
    setIsDialogOpen(false);
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
    return <ConsultantLoader />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEO 
          title="Admin Authentication - Peace2Hearts"
          description="Admin authentication for Peace2Hearts platform."
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="section-title text-4xl md:text-5xl text-center mb-8">Admin Authentication</h1>
            <AdminAuth onAuthenticated={handleAuthenticated} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Consultant Management - Peace2Hearts"
        description="Manage consultants for Peace2Hearts platform."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-8">Consultant Management</h1>
          
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Add and manage consultants available on the platform.</p>
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">Add Consultant</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Consultant</DialogTitle>
                    </DialogHeader>
                    <ConsultantForm 
                      onSuccess={handleConsultantAdded}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <ConsultantList 
              consultants={consultants}
              onConsultantUpdated={handleConsultantUpdated}
              loading={loading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantManagement;
