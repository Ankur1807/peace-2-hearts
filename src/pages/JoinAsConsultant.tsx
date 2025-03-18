
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ConsultantFields from "@/components/consultant/ConsultantFields";
import { Card, CardContent } from "@/components/ui/card";

const JoinAsConsultant = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Consultant-specific state
  const [specialization, setSpecialization] = useState("mental-health");
  const [hourlyRate, setHourlyRate] = useState(2500);
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [availableHours, setAvailableHours] = useState("9:00-17:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to submit your application.");
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

      // Create consultant record
      const { error: consultantError } = await supabase
        .from("consultants")
        .insert({
          profile_id: authData.user.id,
          specialization,
          hourly_rate: hourlyRate,
          bio,
          qualifications,
          available_days: availableDays,
          available_hours: availableHours,
          is_available: false, // Consultants start as unavailable until approved
        });

      if (consultantError) throw consultantError;

      // Sign out the user after successful consultant application
      await supabase.auth.signOut();

      // Navigate to consultant application success page
      navigate("/consultant-application-success");
      
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      console.error("Consultant application error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Join as a Consultant - Peace2Hearts"
        description="Apply to join the Peace2Hearts team as a mental health or legal consultant and help others find peace."
      />
      <Navigation />
      <main className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Consultant Network</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share your expertise and help others navigate their relationship challenges as part of our trusted network of professionals.
            </p>
          </div>
          
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className="mt-1"
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
                        className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                  </div>
                
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Professional Details</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Tell us about your professional experience and how you can contribute to Peace2Hearts.
                    </p>
                    <ConsultantFields
                      specialization={specialization}
                      setSpecialization={setSpecialization}
                      hourlyRate={hourlyRate}
                      setHourlyRate={setHourlyRate}
                      bio={bio}
                      setBio={setBio}
                      qualifications={qualifications}
                      setQualifications={setQualifications}
                      availableDays={availableDays}
                      setAvailableDays={setAvailableDays}
                      availableHours={availableHours}
                      setAvailableHours={setAvailableHours}
                    />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms} 
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal"
                    >
                      I agree to the Peace2Hearts{" "}
                      <a href="/terms" className="text-vibrantPurple hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-vibrantPurple hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
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
                  {isLoading ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <a href="/sign-in" className="text-vibrantPurple hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JoinAsConsultant;
