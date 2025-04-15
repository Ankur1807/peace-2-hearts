
import { SEO } from '@/components/SEO';
import { useState, useEffect } from "react";
import { Consultant, getConsultants } from "@/utils/consultants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConsultantList from "@/components/consultants/ConsultantList";

const AdminConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultants();
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

  return (
    <>
      <SEO
        title="Manage Consultants - Peace2Hearts Admin"
        description="Manage consultants for the Peace2Hearts platform"
      />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Consultants</h1>
          <Button asChild>
            <Link to="/add-consultant">Add Consultant</Link>
          </Button>
        </div>
        
        <ConsultantList 
          consultants={consultants}
          onConsultantUpdated={handleConsultantUpdated}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AdminConsultants;
