import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to check and monitor admin status using server verification
 */
export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    
    // Check admin status every 5 minutes to ensure session remains valid
    const intervalId = setInterval(checkAdminStatus, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsAdminChecking(true);
      
      // Use admin-status edge function for server verification
      const { data, error } = await supabase.functions.invoke('admin-status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data?.is_admin || false);
      
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsAdminChecking(false);
    }
  };

  return {
    isAdmin,
    isAdminChecking,
    checkAdminStatus
  };
};