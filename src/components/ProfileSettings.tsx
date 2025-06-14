
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateDisplayName, loading } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    setDisplayName(profile?.display_name || '');
  }, [profile?.display_name]);

  const handleUpdate = async () => {
    setUpdating(true);
    await updateDisplayName(displayName);
    setUpdating(false);
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
            placeholder="Enter your display name (leave blank for Anonymous)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Display names must be unique. Leave blank to appear as "Anonymous" on leaderboards.
          </p>
        </div>
        <Button 
          onClick={handleUpdate} 
          disabled={loading || updating || displayName === profile?.display_name}
        >
          {updating ? 'Updating...' : 'Update Display Name'}
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSettings;
