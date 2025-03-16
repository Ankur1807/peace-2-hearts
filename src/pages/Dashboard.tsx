import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { getUserProfile, signOut } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: Date;
  service: string;
  specialist: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        const userProfile = await getUserProfile();
        
        if (!userProfile) {
          navigate("/sign-in");
          return;
        }
        
        setUser(userProfile as UserProfile);
        
        // For now, we'll keep using mock appointment data
        // Later, this would be replaced with a real fetch from Supabase
        setAppointments([
          {
            id: "1",
            date: new Date(new Date().getTime() + 86400000 * 3), // 3 days from now
            service: "Mental Health Consultation",
            specialist: "Dr. Sarah Johnson",
            status: "upcoming",
          },
          {
            id: "2",
            date: new Date(new Date().getTime() - 86400000 * 7), // 7 days ago
            service: "Legal Consultation",
            specialist: "Atty. Michael Chen",
            status: "completed",
          },
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <p className="text-center">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <SEO 
        title="Dashboard"
        description="Manage your consultations, documents, and messages with Peace2Hearts through your personalized dashboard."
        keywords="client dashboard, manage appointments, relationship counseling, legal consultations"
        ogType="website"
      />
      <Navigation />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-lora font-semibold">Welcome, {user.full_name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>

          <Tabs defaultValue="appointments" className="space-y-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Appointments</h2>
                <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90" onClick={() => navigate("/book-consultation")}>
                  Book New Consultation
                </Button>
              </div>

              {appointments.length > 0 ? (
                <div className="grid gap-4">
                  {appointments
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">{format(appointment.date, "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-500" />
                                <span>{format(appointment.date, "h:mm a")}</span>
                              </div>
                              <h3 className="text-lg font-semibold">{appointment.service}</h3>
                              <p className="text-gray-600">with {appointment.specialist}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                appointment.status === "upcoming" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : appointment.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              {appointment.status === "upcoming" && (
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" size="sm">Reschedule</Button>
                                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Cancel</Button>
                                </div>
                              )}
                              {appointment.status === "completed" && (
                                <Button variant="outline" size="sm" className="mt-2">Leave Feedback</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You don't have any appointments yet.</p>
                    <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90" onClick={() => navigate("/book-consultation")}>
                      Book Your First Consultation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <h2 className="text-xl font-semibold">Your Documents</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>View and download your documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 border rounded-md">
                    <FileText className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Consultation Summary - Mental Health</p>
                      <p className="text-sm text-gray-500">Uploaded on May 15, 2023</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                  </div>
                  <div className="flex items-center p-3 border rounded-md">
                    <FileText className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium">Legal Agreement</p>
                      <p className="text-sm text-gray-500">Uploaded on April 2, 2023</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <h2 className="text-xl font-semibold">Your Messages</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Recent messages from your specialists.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start p-3 border rounded-md">
                    <MessageSquare className="h-5 w-5 mr-3 mt-1 text-gray-500" />
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">Dr. Sarah Johnson</p>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600">Hi there! I've sent you some resources to review before our next appointment. Please let me know if you have any questions.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 border rounded-md">
                    <MessageSquare className="h-5 w-5 mr-3 mt-1 text-gray-500" />
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">Atty. Michael Chen</p>
                        <span className="text-xs text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-600">I've reviewed your documents and would like to schedule a follow-up call to discuss next steps. Please let me know your availability.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
