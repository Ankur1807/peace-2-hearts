
import { SEO } from '@/components/SEO';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password should be at least 8 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the admin-update-password edge function
      const { data, error } = await supabase.functions.invoke('admin-update-password', {
        body: {
          currentPassword,
          newPassword
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to update password');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      setSuccess("Password successfully updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Success",
        description: "Admin password has been updated",
      });
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password");
      toast({
        title: "Error",
        description: err.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <SEO
        title="Admin Settings - Peace2Hearts"
        description="Manage admin settings for Peace2Hearts platform"
      />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="grid grid-cols-1 gap-6 max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Admin Password</CardTitle>
              <CardDescription>
                Update the admin portal password
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
