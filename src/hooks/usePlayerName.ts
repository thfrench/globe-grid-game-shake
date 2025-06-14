// This hook is deprecated - we now use authentication instead
// Keeping for compatibility during transition
export const usePlayerName = () => {
  console.warn('usePlayerName is deprecated - use useAuth and useProfile instead');
  
  return {
    playerName: '',
    setPlayerName: () => {},
    sessionId: '',
    clearAllData: () => {}
  };
};
