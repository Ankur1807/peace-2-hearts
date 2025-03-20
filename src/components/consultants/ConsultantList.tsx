
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Consultant, updateConsultantAvailability } from "@/utils/consultantApi";
import { useToast } from "@/hooks/use-toast";

interface ConsultantListProps {
  consultants: Consultant[];
  onConsultantUpdated: (updatedConsultant: Consultant) => void;
  loading?: boolean;
}

const ConsultantList = ({ consultants, onConsultantUpdated, loading = false }: ConsultantListProps) => {
  const { toast } = useToast();

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
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
            <TableCell className="font-medium">{consultant.name || "Unnamed"}</TableCell>
            <TableCell>{consultant.specialization}</TableCell>
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
  );
};

export default ConsultantList;
