
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { usePlayerName } from '@/hooks/usePlayerName';

const DebugClearMemory: React.FC = () => {
  const { clearAllData } = usePlayerName();

  const handleClearMemory = () => {
    if (confirm('Are you sure you want to clear all local data? This will reset your name, scores, and session.')) {
      clearAllData();
      window.location.reload();
    }
  };

  // Check for debug in hash instead of search params
  const isDebugMode = window.location.hash.includes('debug');
  
  if (!isDebugMode) {
    return null;
  }

  return (
    <Button
      onClick={handleClearMemory}
      variant="destructive"
      size="sm"
      className="ml-2"
      title="Clear all local data (debug mode)"
    >
      <Trash2 size={16} />
      Clear Memory
    </Button>
  );
};

export default DebugClearMemory;
