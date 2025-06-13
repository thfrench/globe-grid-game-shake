
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  const gameModes = [
    {
      id: 'find-flag' as GameMode,
      icon: '🔍',
      title: 'Find the Flag',
      description: 'Look at a 5x5 grid of flags and click on the correct flag for the given country name. Test your visual recognition skills!'
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 text-center bg-white/90 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Game Mode</h2>
        
        <div className="flex justify-center gap-4 mb-6">
          {gameModes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? 'default' : 'outline'}
              className="flex flex-col items-center gap-2 h-auto p-4 min-w-[120px]"
              onClick={() => onModeSelect(mode.id)}
            >
              <div className="text-2xl">{mode.icon}</div>
              <div className="font-semibold text-sm">{mode.title}</div>
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={onStartGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          size="lg"
        >
          Start Game
        </Button>
      </Card>

      {selectedModeData && (
        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">{selectedModeData.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedModeData.title}</h3>
            <p className="text-gray-600 leading-relaxed">{selectedModeData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🌍 Global High Scores</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>1. Anonymous</span>
                  <span className="font-mono">2:34</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Anonymous</span>
                  <span className="font-mono">2:45</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Anonymous</span>
                  <span className="font-mono">2:52</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">👤 Your Best Times</h4>
              <div className="text-sm text-gray-500 italic">
                Sign in with Google to track your scores!
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GameModeSelector;
