
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
  return (
    <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Choose Game Mode</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Button
          variant={selectedMode === 'find-flag' ? 'default' : 'outline'}
          className="h-auto p-6 flex flex-col items-center gap-3 text-center"
          onClick={() => onModeSelect('find-flag')}
        >
          <div className="text-3xl">🔍</div>
          <div className="font-semibold text-lg">Find the Flag</div>
          <div className="text-sm text-gray-600 leading-relaxed">
            Click the correct flag from the grid
          </div>
        </Button>
        
        <Button
          variant={selectedMode === 'name-flag' ? 'default' : 'outline'}
          className="h-auto p-6 flex flex-col items-center gap-3 text-center"
          onClick={() => onModeSelect('name-flag')}
        >
          <div className="text-3xl">📝</div>
          <div className="font-semibold text-lg">Name the Flag</div>
          <div className="text-sm text-gray-600 leading-relaxed">
            Choose the country name for the flag
          </div>
        </Button>

        <Button
          variant={selectedMode === 'capital-quiz' ? 'default' : 'outline'}
          className="h-auto p-6 flex flex-col items-center gap-3 text-center"
          onClick={() => onModeSelect('capital-quiz')}
        >
          <div className="text-3xl">🏛️</div>
          <div className="font-semibold text-lg">Capital Quiz</div>
          <div className="text-sm text-gray-600 leading-relaxed">
            Guess which country has the given capital
          </div>
        </Button>
      </div>
      
      <Button 
        onClick={onStartGame}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        size="lg"
      >
        Start Game
      </Button>
    </Card>
  );
};

export default GameModeSelector;
