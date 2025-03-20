
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Consultant, getConsultants, updateConsultantAvailability } from "@/utils/consultantApi";
import DashboardLoader from "./DashboardLoader";

const ConsultantsManagement = () => {
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

  const handleAvailabilityChange = async (consultantId: string, isAvailable: boolean) => {
    try {
      await updateConsultantAvailability(consultantId, isAvailable);
      
      // Update local state
      setConsultants(
        consultants.map(c => 
          c.id === consultantId ? { ...c, is_available: isAvailable } : c
        )
      );
      
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

  if (loading) {
    return <DashboardLoader />;
  }

  if (consultants.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium">No consultants found</h3>
        <p className="text-gray-500 mt-2">
          There are currently no consultants in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Consultants</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Specialization</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Available Days</TableHead>
            <TableHead>Available Hours</TableHead>
            <TableHead>Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id}>
              <TableCell className="font-medium">{consultant.specialization}</TableCell>
              <TableCell>₹{consultant.hourly_rate}</TableCell>
              <TableCell>
                {consultant.available_days?.join(", ") || "Not specified"}
              </TableCell>
              <TableCell>{consultant.available_hours || "Not specified"}</TableCell>
              <TableCell>
                <Switch 
                  checked={consultant.is_available} 
                  onCheckedChange={(checked) => handleAvailabilityChange(consultant.id, checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConsultantsManagement;
