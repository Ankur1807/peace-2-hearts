
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check if user is authenticated
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setIsAdmin(false);
          setIsAdminChecking(false);
          return;
        }
        
        // Then check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsAdminChecking(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      () => {
        checkAdminStatus();
      }
    );

    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { isAdmin, isAdminChecking };
};
