
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Consultant } from "@/utils/consultantApi";

const AddConsultant = () => {
  const navigate = useNavigate();

  const handleSuccess = (consultant: Consultant) => {
    navigate("/consultant-management");
  };

  const handleCancel = () => {
    navigate("/consultant-management");
  };

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
              <Button variant="outline" onClick={handleCancel}>
                Back to Management
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
