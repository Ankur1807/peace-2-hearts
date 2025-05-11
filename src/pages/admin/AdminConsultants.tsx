import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import ConsultantsManagement from '@/components/dashboard/ConsultantsManagement';
import { Consultant } from '@/utils/consultants';
import { supabase } from '@/integrations/supabase/client';

const AdminConsultants: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultants')
        .select('*');
      
      if (error) throw new Error(error.message);
      
      console.log("Fetched consultants:", data);
      setConsultants(data || []);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load consultants: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsultantUpdated = (updatedConsultant: Consultant) => {
    // If the updated consultant is already in our list, update it
    if (consultants.some(c => c.id === updatedConsultant.id)) {
      setConsultants(
        consultants.map(c => 
          c.id === updatedConsultant.id ? updatedConsultant : c
        )
      );
    } 
    // Otherwise it might be a deletion operation, refresh the list
    else {
      fetchConsultants();
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">Consultants Management</h1>
      {error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          {error}
        </div>
      ) : (
        <ConsultantsManagement 
          consultants={consultants} 
          loading={loading}
          onConsultantUpdated={handleConsultantUpdated}
          onRefresh={fetchConsultants}
        />
      )}
    </div>
  );
};

export default AdminConsultants;
