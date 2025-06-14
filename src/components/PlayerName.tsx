
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const PlayerName: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateDisplayName } = useProfile();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  const displayName = profile?.display_name || 'Anonymous';

  const handleEditStart = () => {
    setTempName(profile?.display_name || '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    
    const trimmedName = tempName.trim();
    const success = await updateDisplayName(trimmedName);
    
    if (success) {
      setEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempName(profile?.display_name || '');
      setEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-white">
        Guest Player
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          className="px-2 py-1 rounded text-black"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          autoFocus
          placeholder="Enter display name"
        />
        <button onClick={handleSave} className="text-sm underline text-white">
          Save
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleEditStart}
      className="text-white hover:text-blue-200"
    >
      {displayName}
    </button>
  );
};

export default PlayerName;
