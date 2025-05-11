
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Consultant, updateConsultantAvailability, deleteConsultant } from "@/utils/consultants";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConsultantListProps {
  consultants: Consultant[];
  onConsultantUpdated: (updatedConsultant: Consultant) => void;
  loading?: boolean;
}

const ConsultantList = ({ consultants, onConsultantUpdated, loading = false }: ConsultantListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAvailabilityChange = async (consultantId: string, isAvailable: boolean) => {
    try {
      await updateConsultantAvailability(consultantId, isAvailable);
      
      const updatedConsultant = consultants.find(c => c.id === consultantId);
      if (updatedConsultant) {
        onConsultantUpdated({
          ...updatedConsultant,
          is_available: isAvailable
        });
      }
      
      toast({
        title: "Success",
        description: `Consultant is now ${isAvailable ? 'available' : 'unavailable'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consultant availability",
        variant: "destructive",
      });
    }
  };

  // Generate consultant initials for avatar fallback
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "CN";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleViewDetail = (consultantId: string) => {
    navigate(`/admin/consultants/${consultantId}`);
  };

  const handleDelete = async (consultantId: string) => {
    try {
      await deleteConsultant(consultantId);
      // Remove consultant from the list by updating parent state
      const updatedConsultants = consultants.filter(c => c.id !== consultantId);
      if (updatedConsultants.length > 0) {
        onConsultantUpdated(updatedConsultants[0]); // Trigger parent update
      } else {
        onConsultantUpdated({
          id: "",
          specialization: "",
          is_available: false,
          hourly_rate: 0,
          profile_id: ""
        });
      }
      
      toast({
        title: "Success",
        description: "Consultant deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete consultant",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (consultants.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium">No consultants found</h3>
        <p className="text-gray-500 mt-2">
          There are currently no consultants in the system. Add your first consultant using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Available Days</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  {consultant.profile_picture_url ? (
                    <AvatarImage src={consultant.profile_picture_url} alt={consultant.name || "Consultant"} />
                  ) : (
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  )}
                </Avatar>
              </TableCell>
              <TableCell>{consultant.name || "Unnamed"}</TableCell>
              <TableCell>{consultant.specialization}</TableCell>
              <TableCell>{consultant.experience || 0} years</TableCell>
              <TableCell>₹{consultant.hourly_rate}</TableCell>
              <TableCell className="max-w-[150px] truncate">
                {consultant.available_days?.join(", ") || "Not specified"}
              </TableCell>
              <TableCell>
                <Switch 
                  checked={consultant.is_available} 
                  onCheckedChange={(checked) => handleAvailabilityChange(consultant.id, checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetail(consultant.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Consultant</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this consultant? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(consultant.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConsultantList;
