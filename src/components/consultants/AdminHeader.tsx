
import React from "react";
import { Button } from "@/components/ui/button";
import AddConsultantModal from "./AddConsultantModal";
import { Consultant } from "@/utils/consultants";

interface AdminHeaderProps {
  onConsultantAdded: (newConsultant: Consultant) => void;
  onSignOut: () => void;
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onConsultantAdded, 
  onSignOut, 
  title 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onSignOut}
        >
          Sign Out
        </Button>
        <AddConsultantModal onConsultantAdded={onConsultantAdded} />
      </div>
    </div>
  );
};

export default AdminHeader;
