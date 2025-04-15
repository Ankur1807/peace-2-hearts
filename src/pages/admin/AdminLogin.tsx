
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdmin } from "@/hooks/useAdminContext";
import { Logo } from "@/components/navigation/Logo";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await adminLogin(password);
      
      if (result.success) {
        navigate("/admin");
      } else {
        throw new Error(result.error || "Invalid password");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login - Peace2Hearts"
        description="Login to the admin portal"
      />
      
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="mb-8">
            <Logo />
          </div>
          
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
              <CardDescription className="text-center">
                Enter your password to access the admin area
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
