
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || '');
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
      <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
            Display Name
          </label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
          />
        </div>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSettings;
