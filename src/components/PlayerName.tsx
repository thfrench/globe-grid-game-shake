import React, { useState } from 'react';
import { usePlayerName } from '@/hooks/usePlayerName';

const PlayerName: React.FC = () => {
  const { playerName, setPlayerName } = usePlayerName();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const handleSave = () => {
    setPlayerName(tempName.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          className="px-2 py-1 rounded text-black"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          autoFocus
        />
        <button onClick={handleSave} className="text-sm underline text-white">
          Save
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-white hover:text-blue-200"
    >
      {playerName || 'Set Name'}
    </button>
  );
};

export default PlayerName;
