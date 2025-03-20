
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Consultant, getConsultants, updateConsultantAvailability, createConsultant } from "@/utils/consultantApi";
import DashboardLoader from "./DashboardLoader";

const ConsultantsManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "legal",
    hourly_rate: 1000,
    bio: "",
    qualifications: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_hours: "9:00-17:00",
    is_available: true,
    profile_id: "00000000-0000-0000-0000-000000000000" // This would need to be set properly in a real implementation
  });
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Parse hourly rate as a number
      const consultantData = {
        ...formData,
        hourly_rate: Number(formData.hourly_rate)
      };
      
      const newConsultant = await createConsultant(consultantData);
      
      // Add new consultant to the list
      setConsultants([...consultants, newConsultant]);
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Consultant added successfully",
      });
      
      // Reset form data
      setFormData({
        specialization: "legal",
        hourly_rate: 1000,
        bio: "",
        qualifications: "",
        available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        available_hours: "9:00-17:00",
        is_available: true,
        profile_id: "00000000-0000-0000-0000-000000000000"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add consultant",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Consultants</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Consultant</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Consultant</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                    <SelectItem value="family_therapy">Family Therapy</SelectItem>
                    <SelectItem value="mediation">Mediation</SelectItem>
                    <SelectItem value="divorce">Divorce</SelectItem>
                    <SelectItem value="custody">Child Custody</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Consultant's biographical information"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="Consultant's qualifications and credentials"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="available_hours">Available Hours</Label>
                <Input
                  id="available_hours"
                  name="available_hours"
                  value={formData.available_hours}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00-17:00"
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Consultant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {consultants.length === 0 ? (
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium">No consultants found</h3>
          <p className="text-gray-500 mt-2">
            There are currently no consultants in the system.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ConsultantsManagement;
