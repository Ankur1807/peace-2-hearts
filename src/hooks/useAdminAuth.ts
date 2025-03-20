
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin } from "@/utils/authUtils";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
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
    }
  }, [isAdmin, isAdminChecking, navigate]);

  return { isAdmin, isAdminChecking };
};
