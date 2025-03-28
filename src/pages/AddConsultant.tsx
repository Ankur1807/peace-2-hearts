import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Consultant } from "@/utils/consultantApi";
import AdminAuth from "@/components/consultants/AdminAuth";
import { useToast } from "@/hooks/use-toast";
import { ensureStorageBucketExists } from "@/utils/authUtils";

const AddConsultant = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
    
    // Get authentication timestamp
    const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
    
    // Check if auth is valid (less than 1 hour old)
    const isAuthValid = adminAuthenticated && (Date.now() - authTime < 60 * 60 * 1000);
    
    if (!isAuthValid && adminAuthenticated) {
      // Clear expired auth
      localStorage.removeItem('p2h_admin_authenticated');
      localStorage.removeItem('p2h_admin_auth_time');
      toast({
        title: "Session expired",
        description: "Please sign in again to continue",
        variant: "destructive"
      });
    }
    
    setIsAuthenticated(isAuthValid);
    
    // Ensure the storage bucket exists for consultant profile pictures
    ensureStorageBucketExists();
  }, [toast]);

  const handleSuccess = (consultant: Consultant) => {
    toast({
      title: "Consultant added",
      description: "The consultant has been successfully added."
    });
    
    // Redirect to home page after successful consultant addition
    navigate("/");
  };

  const handleCancel = () => {
    // Clear admin authentication
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
    // Redirect to home page
    navigate("/");
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
  };

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
        title="Add New Consultant - Peace2Hearts"
        description="Add a new consultant to the Peace2Hearts platform."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="section-title text-3xl md:text-4xl">Add New Consultant</h1>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('p2h_admin_authenticated');
                  localStorage.removeItem('p2h_admin_auth_time');
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <ConsultantForm 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AddConsultant;
