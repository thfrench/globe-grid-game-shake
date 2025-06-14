
import React, { useState } from 'react';
import { usePlayerName } from '@/hooks/usePlayerName';
import { useHighScores } from '@/hooks/useHighScores';

const PlayerName: React.FC = () => {
  const { playerName, setPlayerName } = usePlayerName();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(playerName);
  
  // We'll use find-flag as the default mode for updating scores
  // This will update scores across all game modes for this session
  const { updatePlayerNameInScores } = useHighScores('find-flag');

  const handleSave = async () => {
    if (tempName.trim() && tempName.trim() !== playerName) {
      const oldName = playerName;
      setPlayerName(tempName.trim());
      setEditing(false);
      
      // If the name actually changed, update all scores for this session
      if (oldName !== tempName.trim()) {
        console.log('Player name changed at top, updating all scores...');
        // Small delay to ensure the name is saved first
        setTimeout(async () => {
          await updatePlayerNameInScores();
        }, 100);
      }
    } else {
      setEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempName(playerName);
      setEditing(false);
    }
  };

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
        />
        <button onClick={handleSave} className="text-sm underline text-white">
          Save
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setTempName(playerName);
        setEditing(true);
      }}
      className="text-white hover:text-blue-200"
    >
      {playerName || 'Set Name'}
    </button>
  );
};

export default PlayerName;
