
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Importing our components
import ServicePricing from '@/components/pricing/ServicePricing';
import PackagePricing from '@/components/pricing/PackagePricing';
import DiscountCodes from '@/components/pricing/DiscountCodes';
import PricingHistory from '@/components/pricing/PricingHistory';

// Define the schema for the login form
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const PricingManagement = () => {
  const { isAdmin, isAdminChecking, isAuthenticated, loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('services');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Setup form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoggingIn(true);
      
      const result = await loginAsAdmin(values.email, values.password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to pricing management",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdminChecking && !isAdmin && isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isAdminChecking, isAuthenticated, navigate, toast]);

  if (isAdminChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peacefulBlue"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <SEO 
          title="Admin Login - Peace2Hearts"
          description="Login to access pricing management"
        />
        <Navigation />
        
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-md">
            <h1 className="text-4xl font-lora font-bold text-center mb-12">Admin Login</h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-lora">Admin Access</CardTitle>
                <CardDescription>
                  Please login to access pricing management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                  Only authenticated users can access pricing management
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <Footer />
        <Toaster />
      </>
    );
  }

  // Show pricing management if authenticated and admin
  return (
    <>
      <SEO 
        title="Pricing Management - Peace2Hearts Admin"
        description="Manage service pricing, packages, and discount codes."
      />
      <Navigation />
      
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-lora font-bold">Pricing Management</h1>
            <Button 
              variant="outline" 
              onClick={async () => {
                await supabase.auth.signOut();
                toast({
                  title: "Signed out",
                  description: "You have been signed out"
                });
              }}
            >
              Sign Out
            </Button>
          </div>
          
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
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </>
  );
};

export default PricingManagement;
