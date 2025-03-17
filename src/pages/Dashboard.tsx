
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from '@/components/SEO';
import { getUserProfile, signOut } from "@/utils/authUtils";
import { fetchUserConsultations } from "@/utils/consultationUtils";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "@/components/dashboard/UserProfile";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone_number?: string | null;
}

interface Appointment {
  id: string;
  date: Date;
  service: string;
  specialist: string;
  status: "upcoming" | "completed" | "cancelled";
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
        
        // Fetch actual consultations from Supabase
        const userAppointments = await fetchUserConsultations();
        setAppointments(userAppointments);
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

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

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
          <UserProfile 
            user={user} 
            onSignOut={handleSignOut} 
            onProfileUpdate={handleProfileUpdate} 
          />
          <DashboardTabs appointments={appointments} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
