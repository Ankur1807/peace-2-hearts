
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  user: {
    id: string;
    full_name: string | null;
    email: string;
    phone_number?: string | null;
  } | null;
  onSignOut: () => Promise<void>;
  onProfileUpdate: (updatedUser: any) => void;
}

const UserProfile = ({ user, onSignOut, onProfileUpdate }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || "");
  const [editPhone, setEditPhone] = useState(user?.phone_number || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile({
        full_name: editName,
        phone_number: editPhone
      });
      
      const updatedUser = {
        ...user,
        full_name: editName,
        phone_number: editPhone
      };
      
      onProfileUpdate(updatedUser);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
      {isEditing ? (
        <div className="space-y-4 w-full md:w-1/2">
          <h1 className="text-3xl font-lora font-semibold">Edit Profile</h1>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              value={editPhone} 
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveProfile} 
              className="bg-peacefulBlue hover:bg-peacefulBlue/90"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-lora font-semibold">Welcome, {user.full_name || "User"}</h1>
          <p className="text-gray-600">{user.email}</p>
          {user.phone_number && (
            <p className="text-gray-600">{user.phone_number}</p>
          )}
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="mt-2"
          >
            Edit Profile
          </Button>
        </div>
      )}
      <Button variant="outline" onClick={onSignOut}>Sign Out</Button>
    </div>
  );
};

export default UserProfile;
