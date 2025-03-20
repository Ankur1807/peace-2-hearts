
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import AppointmentsTab from "@/components/dashboard/AppointmentsTab";
import MessagesTab from "@/components/dashboard/MessagesTab";
import DocumentsTab from "@/components/dashboard/DocumentsTab";
import UserProfile from "@/components/dashboard/UserProfile";
import ConsultantsManagement from "@/components/dashboard/ConsultantsManagement";
import { checkAuthentication, getUserProfile, signOut } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock appointments data until we implement actual appointment fetching
  const mockAppointments = [
    {
      id: "appt-1",
      date: new Date(Date.now() + 86400000), // tomorrow
      service: "Legal Consultation",
      specialist: "John Doe",
      status: "upcoming" as const
    },
    {
      id: "appt-2",
      date: new Date(Date.now() - 86400000), // yesterday
      service: "Mental Health Counseling",
      specialist: "Jane Smith",
      status: "completed" as const
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        navigate("/signin");
        return;
      }
      
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUserProfile(updatedUser);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <SEO 
        title="Dashboard - Peace2Hearts"
        description="Access your consultations, messages, and documents in your personal dashboard."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-8">Your Dashboard</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 lg:w-1/4">
              <UserProfile 
                user={userProfile}
                onSignOut={handleSignOut}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
            
            <div className="md:w-2/3 lg:w-3/4">
              <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="mt-6">
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="appointments">
                    <AppointmentsTab appointments={mockAppointments} />
                  </TabsContent>
                  <TabsContent value="messages">
                    <MessagesTab />
                  </TabsContent>
                  <TabsContent value="documents">
                    <DocumentsTab />
                  </TabsContent>
                  <TabsContent value="consultants">
                    <ConsultantsManagement />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
