
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Consultant, getConsultantById, updateConsultantAvailability } from '@/utils/consultants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ConsultantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    bio: '',
    is_available: true
  });

  useEffect(() => {
    if (id) {
      loadConsultant(id);
    }
  }, [id]);

  const loadConsultant = async (consultantId: string) => {
    try {
      setLoading(true);
      const data = await getConsultantById(consultantId);
      
      if (!data) {
        toast({
          title: "Error",
          description: "Consultant not found",
          variant: "destructive",
        });
        navigate('/admin/consultants');
        return;
      }
      
      setConsultant(data);
      setFormData({
        phone: data.phone || '',
        bio: data.bio || '',
        is_available: data.is_available
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load consultant: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleAvailability = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_available: checked
    }));
  };

  const handleSave = async () => {
    if (!consultant || !id) return;
    
    try {
      setSaving(true);
      
      // Update the consultant details
      const { error } = await supabase
        .from('consultants')
        .update({
          bio: formData.bio,
          is_available: formData.is_available
        })
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      // If we got here, the update was successful
      toast({
        title: "Success",
        description: "Consultant details updated successfully",
      });
      
      // Update local state
      setConsultant({
        ...consultant,
        bio: formData.bio,
        is_available: formData.is_available
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update consultant: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generate initials for the avatar
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "C";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Consultant not found</h2>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/admin/consultants')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Consultants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/consultants')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Consultants
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            {consultant.profile_picture_url ? (
              <AvatarImage src={consultant.profile_picture_url} alt={consultant.name || "Consultant"} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/10">
                {getInitials(consultant.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{consultant.name || "Unnamed Consultant"}</CardTitle>
            <p className="text-muted-foreground">{consultant.specialization || "No specialization"}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={consultant.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" value={consultant.specialization || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
              <Input id="hourly_rate" value={consultant.hourly_rate?.toString() || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input id="experience" value={consultant.experience?.toString() || '0'} disabled />
            </div>
          </div>

          {/* Editable fields */}
          <div className="pt-4 border-t">
            <h3 className="font-medium text-lg mb-4">Edit Details</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label htmlFor="is_available">Available for Booking</Label>
                <Switch 
                  id="is_available" 
                  checked={formData.is_available} 
                  onCheckedChange={handleToggleAvailability}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Description</Label>
                <Textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-[120px]"
                  placeholder="Enter consultant bio or description..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultantDetail;
