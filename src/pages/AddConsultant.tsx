
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Consultant } from "@/utils/consultantApi";
import AdminAuth from "@/components/consultants/AdminAuth";

const AddConsultant = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
    setIsAuthenticated(adminAuthenticated);
  }, []);

  const handleSuccess = (consultant: Consultant) => {
    // Clear any form data
    localStorage.removeItem('p2h_admin_authenticated');
    // Redirect to home page after successful consultant addition
    navigate("/");
  };

  const handleCancel = () => {
    // Clear any form data
    localStorage.removeItem('p2h_admin_authenticated');
    // Redirect to home page
    navigate("/");
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
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
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
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
