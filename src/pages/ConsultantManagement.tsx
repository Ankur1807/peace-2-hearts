
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Consultant, getConsultants, updateConsultantAvailability, createConsultant } from "@/utils/consultantApi";
import { checkIsAdmin } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "legal",
    hourly_rate: 1000,
    bio: "",
    qualifications: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_hours: "9:00-17:00",
    is_available: true,
    profile_id: "00000000-0000-0000-0000-000000000000",
    profile_picture: null as File | null
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      } finally {
        setIsAdminChecking(false);
      }
    };

    checkAdminStatus();
  }, [toast]);

  useEffect(() => {
    if (!isAdminChecking && !isAdmin) {
      navigate('/');
    } else if (!isAdminChecking && isAdmin) {
      fetchConsultants();
    }
  }, [isAdmin, isAdminChecking, navigate]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({
        ...formData,
        profile_picture: event.target.files[0]
      });
    }
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
      const consultantData = {
        ...formData,
        hourly_rate: Number(formData.hourly_rate)
      };
      
      const newConsultant = await createConsultant(consultantData);
      
      setConsultants([...consultants, newConsultant]);
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Consultant added successfully",
      });
      
      setFormData({
        name: "",
        specialization: "legal",
        hourly_rate: 1000,
        bio: "",
        qualifications: "",
        available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        available_hours: "9:00-17:00",
        is_available: true,
        profile_id: "00000000-0000-0000-0000-000000000000",
        profile_picture: null
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add consultant",
        variant: "destructive",
      });
    }
  };

  if (isAdminChecking) {
    return (
      <>
        <SEO 
          title="Loading - Peace2Hearts"
          description="Loading consultant management..."
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p>Checking credentials...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Consultant Management - Peace2Hearts"
        description="Manage consultants for Peace2Hearts platform."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-8">Consultant Management</h1>
          
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Add and manage consultants available on the platform.</p>
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
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Consultant's full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile_picture">Profile Picture</Label>
                      <Input
                        id="profile_picture"
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    
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
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : consultants.length === 0 ? (
              <div className="p-6 text-center border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium">No consultants found</h3>
                <p className="text-gray-500 mt-2">
                  There are currently no consultants in the system. Add your first consultant using the button above.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantManagement;
