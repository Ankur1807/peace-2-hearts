
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to sign up.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Regular user flow
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. You can now sign in.",
      });
      navigate("/sign-in");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up - Peace2Hearts"
        description="Create an account with Peace2Hearts to access mental health and legal support services."
      />
      <Navigation />
      <main className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
          
          <div className="mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                    minLength={6}
                  />
                </div>
                
                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms} 
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-purple-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-purple-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 text-center">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-purple-600 hover:underline">
                Sign In
              </Link>
            </p>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-gray-600 mb-2">Are you a mental health or legal professional?</p>
              <Link to="/join-as-consultant" className="text-purple-600 hover:underline">
                Apply to join our consultant network
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignUp;
