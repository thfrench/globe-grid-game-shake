
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateDisplayName = useCallback(async (displayName: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: displayName.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "This display name is already taken. Please choose another one.",
            variant: "destructive"
          });
          return false;
        } else {
          console.error('Error updating display name:', error);
          toast({
            title: "Error",
            description: "Failed to update display name",
            variant: "destructive"
          });
          return false;
        }
      } else {
        // Update local state
        setProfile(prev => prev ? { ...prev, display_name: displayName.trim() || null } : null);
        toast({
          title: "Success",
          description: "Display name updated successfully"
        });
        return true;
      }
    } catch (error) {
      console.error('Error in updateDisplayName:', error);
      toast({
        title: "Error",
        description: "Failed to update display name",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updateDisplayName,
    refetch: fetchProfile
  };
};
