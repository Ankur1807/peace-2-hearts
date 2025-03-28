
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { SEO } from '@/components/SEO';
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "ankurb@peace2hearts.com";
const ADMIN_PASSWORD = "adminP2H@30";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set admin authentication in localStorage
      localStorage.setItem('p2h_admin_authenticated', 'true');
      
      toast({
        title: "Admin sign in successful",
        description: "Welcome to the consultant management"
      });
      
      navigate("/add-consultant");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sign in successful",
        description: "Welcome back to Peace2Hearts",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign In"
        description="Sign in to your Peace2Hearts account to manage your consultations, access resources, and connect with our experts."
        keywords="sign in, login, Peace2Hearts account, relationship counseling account"
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-lora text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="hello@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-peacefulBlue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-peacefulBlue hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignIn;
