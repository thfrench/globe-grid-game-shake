
import { useState, useEffect } from 'react';

const PLAYER_NAME_KEY = 'player_name';
const SESSION_ID_KEY = 'session_id';

// Generate a unique session ID if one doesn't exist
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

export const usePlayerName = () => {
  const [playerName, setPlayerNameState] = useState('');
  const [sessionId, setSessionId] = useState(getOrCreateSessionId());

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

  const clearAllData = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Reset state
    setPlayerNameState('');
    setSessionId(getOrCreateSessionId());
    
    console.log('All local data cleared');
  };

  return { playerName, setPlayerName, sessionId, clearAllData };
};
