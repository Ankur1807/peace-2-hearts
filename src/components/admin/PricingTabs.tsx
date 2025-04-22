
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { checkIsAdmin } from '@/utils/authUtils';

// Importing our components
import ServicePricing from '@/components/pricing/ServicePricing';
import PackagePricing from '@/components/pricing/PackagePricing';
import DiscountCodes from '@/components/pricing/DiscountCodes';
import PricingHistory from '@/components/pricing/PricingHistory';

interface PricingTabsProps {
  defaultTab?: string;
}

const PricingTabs = ({ defaultTab = 'services' }: PricingTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsAuthenticating(true);
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log('User is authenticated:', data.session.user);
        setIsAuthenticated(true);
        
        // Also check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
        console.log('User is admin:', adminStatus);
        
        // Refresh auth token to ensure it's not expired
        await supabase.auth.refreshSession();
      } else {
        console.log('No active session found');
        setIsAuthenticated(false);
        setIsAdmin(false);
        
        // Try to sign in with stored credentials if available
        await signInWithStoredCredentials();
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Try to sign in using stored credentials if available
  const signInWithStoredCredentials = async () => {
    try {
      const adminApiKey = localStorage.getItem('admin_api_key');
      
      if (adminApiKey) {
        // Use API key to authenticate
        try {
          const { data, error } = await supabase.functions.invoke('admin-auth', {
            body: { apiKey: adminApiKey }
          });
          
          if (!error && data?.success) {
            localStorage.setItem('p2h_admin_authenticated', 'true');
            localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
            setIsAuthenticated(true);
            setIsAdmin(true);
            
            toast({
              title: "Authentication successful",
              description: "You have been authenticated as an admin."
            });
          } else {
            console.error('API key authentication failed:', error || data?.error);
            localStorage.removeItem('admin_api_key');
          }
        } catch (error) {
          console.error('Error authenticating with API key:', error);
          localStorage.removeItem('admin_api_key');
        }
      }
    } catch (error) {
      console.error('Error signing in with stored credentials:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
    localStorage.removeItem('admin_api_key');
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    toast({
      title: "Signed out",
      description: "You have been signed out"
    });
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@peace2hearts.com',
        password: 'password123'
      });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setIsAuthenticated(true);
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
        
        toast({
          title: "Signed in",
          description: "You have been signed in as admin"
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Could not sign in",
        variant: "destructive"
      });
    }
  };

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue" />
        <span className="ml-2 text-lg">Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Pricing Management</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm mr-2">
            {isAuthenticated ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Admin Access: Active</span>
            ) : (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Admin Access: Inactive</span>
            )}
          </div>
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      {!isAuthenticated ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-amber-800 mb-2">Admin Authentication Required</h2>
          <p className="text-amber-700 mb-4">
            You need administrator privileges to manage pricing. Please sign in using the button above.
          </p>
          <p className="text-sm text-amber-600">
            Note: For testing, you can use admin@peace2hearts.com / password123
          </p>
        </div>
      ) : !isAdmin ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-amber-800 mb-2">Admin Privileges Required</h2>
          <p className="text-amber-700 mb-4">
            Your account doesn't have admin privileges. Please sign in with an admin account.
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="py-8">
            <ServicePricing />
          </TabsContent>
          
          <TabsContent value="packages" className="py-8">
            <PackagePricing />
          </TabsContent>
          
          <TabsContent value="discounts" className="py-8">
            <DiscountCodes />
          </TabsContent>
          
          <TabsContent value="history" className="py-8">
            <PricingHistory />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PricingTabs;
