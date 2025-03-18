
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEO } from '@/components/SEO';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  
  // Consultant specific fields
  const [specialization, setSpecialization] = useState("mental-health");
  const [hourlyRate, setHourlyRate] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableHours, setAvailableHours] = useState<string>("9:00-17:00");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            is_consultant: activeTab === "consultant",
            specialization: activeTab === "consultant" ? specialization : null,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If signing up as a consultant, save consultant-specific information
      if (activeTab === "consultant") {
        const { data: profile } = await supabase.auth.getUser();
        
        if (profile?.user) {
          const { error: consultantError } = await supabase
            .from('consultants')
            .insert({
              profile_id: profile.user.id,
              specialization: specialization,
              hourly_rate: parseFloat(hourlyRate) || 0,
              is_available: false, // Set to false initially until approved
              bio: bio,
              qualifications: qualifications,
              available_days: availableDays,
              available_hours: availableHours
            });
            
          if (consultantError) {
            console.error("Error saving consultant information:", consultantError);
            toast({
              title: "Registration partially completed",
              description: "Your account was created but we couldn't save your consultant information. Please contact support.",
              variant: "destructive",
            });
          }
        }
      }

      toast({
        title: activeTab === "consultant" ? "Application received" : "Account created",
        description: activeTab === "consultant" 
          ? "Your application to become a consultant has been received. We'll contact you after reviewing your information."
          : "Welcome to Peace2Hearts! Please check your email to verify your account.",
      });

      // Navigate to appropriate page
      navigate(activeTab === "consultant" ? "/consultant-application-success" : "/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailableDayToggle = (day: string) => {
    setAvailableDays(prevDays => 
      prevDays.includes(day) 
        ? prevDays.filter(d => d !== day) 
        : [...prevDays, day]
    );
  };

  return (
    <>
      <SEO 
        title="Sign Up"
        description="Create your Peace2Hearts account to book consultations, access personalized resources, and begin your journey to relationship wellness."
        keywords="sign up, create account, Peace2Hearts registration, relationship counseling services"
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-lora text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Join Peace2Hearts to manage your consultations
              </CardDescription>
            </CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="user">Register as User</TabsTrigger>
                <TabsTrigger value="consultant">Join as Consultant</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  {/* Common fields for both user types */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                  </div>
                  
                  {/* Consultant-specific fields */}
                  <TabsContent value="consultant" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select 
                        value={specialization} 
                        onValueChange={setSpecialization}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mental-health">Mental Health</SelectItem>
                          <SelectItem value="legal-support">Legal Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (INR)</Label>
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        placeholder="e.g. 1500" 
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        required={activeTab === "consultant"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Available Days</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`day-${day}`} 
                              checked={availableDays.includes(day)}
                              onCheckedChange={() => handleAvailableDayToggle(day)}
                            />
                            <label 
                              htmlFor={`day-${day}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {day.substring(0, 3)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availableHours">Available Hours</Label>
                      <Select 
                        value={availableHours} 
                        onValueChange={setAvailableHours}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your available hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00-17:00">9:00 AM - 5:00 PM</SelectItem>
                          <SelectItem value="10:00-18:00">10:00 AM - 6:00 PM</SelectItem>
                          <SelectItem value="11:00-19:00">11:00 AM - 7:00 PM</SelectItem>
                          <SelectItem value="12:00-20:00">12:00 PM - 8:00 PM</SelectItem>
                          <SelectItem value="custom">Custom Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Input 
                        id="qualifications" 
                        placeholder="Your professional qualifications" 
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                        required={activeTab === "consultant"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Brief Bio</Label>
                      <textarea 
                        id="bio" 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about yourself and your expertise" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required={activeTab === "consultant"}
                      />
                    </div>
                    
                    <div className="text-sm text-amber-600">
                      Note: Your application will be reviewed by our team. You'll be contacted once your application is approved.
                    </div>
                  </TabsContent>
                  
                  <div className="text-sm text-gray-500">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-peacefulBlue hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-peacefulBlue hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : (activeTab === "consultant" ? "Submit Application" : "Create account")}
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-peacefulBlue hover:underline">
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignUp;
