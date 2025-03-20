
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();
  
  // Mock appointments data
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

  // Mock user data since we're not requiring authentication
  const mockUserProfile = {
    id: "demo-user",
    full_name: "Demo User",
    email: "demo@peace2hearts.com",
    phone_number: "+1234567890"
  };

  const handleProfileUpdate = (updatedUser: any) => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };

  const handleSignOut = async () => {
    toast({
      title: "Sign out",
      description: "This is a demo. No sign out functionality implemented."
    });
  };

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
                user={mockUserProfile}
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
