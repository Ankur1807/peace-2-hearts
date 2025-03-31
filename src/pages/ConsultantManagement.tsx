
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Consultant, getConsultants } from "@/utils/consultants";
import ConsultantList from "@/components/consultants/ConsultantList";
import ConsultantLoader from "@/components/consultants/ConsultantLoader";
import AdminAuth from "@/components/consultants/AdminAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isAdminChecking } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchConsultants();
    } else if (!isAdminChecking) {
      setLoading(false);
    }
  }, [isAdmin, isAdminChecking]);

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

  if (isAdminChecking) {
    return <ConsultantLoader />;
  }

  if (!isAdmin) {
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
            <AdminAuth onAuthenticated={() => {}} />
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">Add and manage consultants available on the platform.</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    localStorage.removeItem('p2h_admin_authenticated');
                    window.location.href = '/';
                  }}
                >
                  Sign Out
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/pricing">Manage Pricing</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/add-consultant">Add Consultant</Link>
                </Button>
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
