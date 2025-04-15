
import { SEO } from '@/components/SEO';
import { useState, useEffect } from "react";
import { Consultant, getConsultants } from "@/utils/consultants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConsultantList from "@/components/consultants/ConsultantList";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

const AdminConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleConsultantAdded = (newConsultant: Consultant) => {
    setConsultants([...consultants, newConsultant]);
    setDialogOpen(false);
    toast({
      title: "Success",
      description: "Consultant added successfully",
    });
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Consultant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
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
