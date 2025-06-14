
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHighScores } from '@/hooks/useHighScores';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/utils/gameUtils';

export type GameMode = 'find-flag' | 'name-flag' | 'capital-quiz';

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
  onStartGame: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ 
  selectedMode, 
  onModeSelect, 
  onStartGame 
}) => {
  const { user } = useAuth();
  const { globalScores, personalScores, loading } = useHighScores(selectedMode);

  const gameModes = [
    {
      id: 'find-flag' as GameMode,
      icon: '🔍',
      title: 'Find the Flag',
      description: 'Look at a 4x5 grid of flags and click on the correct flag for the given country name. Test your visual recognition skills!'
    },
    {
      id: 'name-flag' as GameMode,
      icon: '📝',
      title: 'Name the Flag',
      description: 'See a flag and choose the correct country name from multiple choice options. Perfect for learning new flags!'
    },
    {
      id: 'capital-quiz' as GameMode,
      icon: '🏛️',
      title: 'Capital Quiz',
      description: 'Given a capital city, identify which country it belongs to. Great for geography enthusiasts!'
    }
  ];

  const selectedModeData = gameModes.find(mode => mode.id === selectedMode);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-4 text-center bg-white/90 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Game Mode</h2>
        
        <div className="flex justify-center gap-2 mb-4">
          {gameModes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? 'default' : 'outline'}
              className="flex flex-col items-center gap-1 h-auto p-3 min-w-[100px] text-xs"
              onClick={() => onModeSelect(mode.id)}
            >
              <div className="text-lg">{mode.icon}</div>
              <div className="font-medium">{mode.title}</div>
            </Button>
          ))}
        </div>

        {selectedModeData && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedModeData.description}</p>
            <Button 
              onClick={onStartGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              size="default"
            >
              Start Game
            </Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl">
          <h4 className="font-semibold text-gray-800 mb-3 text-center">🌍 Global High Scores</h4>
          {loading ? (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          ) : globalScores.length > 0 ? (
            <div className="space-y-1 text-sm">
              {globalScores.slice(0, 5).map((score, index) => {
                const displayName = score.profiles?.display_name || 'Anonymous';
                return (
                  <div key={score.id} className="flex justify-between">
                    <span>{index + 1}. {displayName} - {formatDate(score.created_at)}</span>
                    <span className="font-mono">{formatTime(score.time_elapsed)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic text-center">
              No scores yet. Be the first!
            </div>
          )}
        </Card>

        <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl">
          <h4 className="font-semibold text-gray-800 mb-3 text-center">👤 Your Best Times</h4>
          {!user ? (
            <div className="text-sm text-gray-500 italic text-center">
              Sign in with Google to see your personal scores!
            </div>
          ) : loading ? (
            <div className="text-center text-sm text-gray-500">Loading...</div>
          ) : personalScores.length > 0 ? (
            <div className="space-y-1 text-sm">
              {personalScores.map((score, index) => (
                <div key={score.id} className="flex justify-between">
                  <span>{index + 1}. {formatDate(score.created_at)}</span>
                  <span className="font-mono">{formatTime(score.time_elapsed)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic text-center">
              Play a game to see your scores!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GameModeSelector;
