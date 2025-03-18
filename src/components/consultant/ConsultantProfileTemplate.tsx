
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConsultantProfile } from "@/types/ConsultantTypes";
import ConsultantSidebar from "./ConsultantSidebar";
import ConsultantDetails from "./ConsultantDetails";
import ConsultantNotFound from "./ConsultantNotFound";
import ConsultantSkeleton from "./ConsultantSkeleton";

const ConsultantProfileTemplate = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultantProfile = async () => {
      if (!consultantId) return;
      
      setIsLoading(true);
      try {
        // Get consultant data by joining profiles and consultants tables
        const { data, error } = await supabase
          .from('consultants')
          .select(`
            id,
            is_available,
            specialization,
            hourly_rate,
            bio,
            qualifications,
            available_days,
            available_hours,
            profiles!inner(
              id,
              full_name,
              email
            )
          `)
          .eq('id', consultantId)
          .single();

        if (error) throw error;
        
        if (data) {
          // Type assertion for the joined profiles data
          const profileData = data.profiles as any;
          
          setConsultant({
            id: data.id,
            full_name: profileData?.full_name || 'Unnamed Consultant',
            email: profileData?.email || '',
            specialization: data.specialization || '',
            bio: data.bio || 'No bio available',
            qualifications: data.qualifications || 'Not specified',
            hourly_rate: data.hourly_rate || 0,
            available_days: data.available_days || [],
            available_hours: data.available_hours || '9:00-17:00',
            is_available: data.is_available ?? false,
            avg_rating: 4.8, // Placeholder
            reviews_count: 12, // Placeholder
          });
        }
      } catch (err) {
        console.error('Error fetching consultant profile:', err);
        setError('Could not load consultant profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (consultantId) {
      fetchConsultantProfile();
    }
  }, [consultantId]);

  if (isLoading) {
    return <ConsultantSkeleton />;
  }

  if (error || !consultant) {
    return <ConsultantNotFound />;
  }

  return (
    <>
      <SEO 
        title={`${consultant.full_name} - ${formatSpecialization(consultant.specialization)} Consultant`}
        description={`${consultant.full_name} is a ${formatSpecialization(consultant.specialization)} consultant at Peace2Hearts. Book a consultation to discuss your needs.`}
        keywords={`${consultant.full_name}, peace2hearts consultant, ${consultant.specialization} counseling, relationship expert`}
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ConsultantSidebar consultant={consultant} />
            <ConsultantDetails consultant={consultant} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

// Format helpers
export const formatSpecialization = (spec: string) => {
  if (spec === 'mental-health') return 'Mental Health';
  if (spec === 'legal-support') return 'Legal Support';
  return spec.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatHours = (hours: string) => {
  if (hours === '9:00-17:00') return '9:00 AM - 5:00 PM';
  if (hours === '10:00-18:00') return '10:00 AM - 6:00 PM';
  if (hours === '11:00-19:00') return '11:00 AM - 7:00 PM';
  if (hours === '12:00-20:00') return '12:00 PM - 8:00 PM';
  return hours;
};

export default ConsultantProfileTemplate;
