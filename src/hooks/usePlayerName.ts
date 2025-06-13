import { useState, useEffect } from 'react';

const PLAYER_NAME_KEY = 'player_name';

export const usePlayerName = () => {
  const [playerName, setPlayerNameState] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(PLAYER_NAME_KEY);
    if (stored) {
      setPlayerNameState(stored);
    }
  }, []);

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
    localStorage.setItem(PLAYER_NAME_KEY, name);
  };

  return { playerName, setPlayerName };
};
