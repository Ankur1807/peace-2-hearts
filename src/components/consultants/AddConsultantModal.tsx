
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Consultant } from "@/utils/consultants";

interface AddConsultantModalProps {
  onConsultantAdded: (newConsultant: Consultant) => void;
}

const AddConsultantModal: React.FC<AddConsultantModalProps> = ({ onConsultantAdded }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConsultantAdded = (consultant: Consultant) => {
    onConsultantAdded(consultant);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Consultant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <ConsultantForm 
          onSuccess={handleConsultantAdded}
          onCancel={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddConsultantModal;
