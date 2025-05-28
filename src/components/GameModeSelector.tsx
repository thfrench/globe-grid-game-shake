
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type GameMode = 'find-flag' | 'name-flag' | 'population-quiz' | 'capital-quiz';

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
    <Card className="p-6 text-center bg-white/80 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Game Mode</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button
          variant={selectedMode === 'find-flag' ? 'default' : 'outline'}
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => onModeSelect('find-flag')}
        >
          <div className="text-2xl">🔍</div>
          <div className="font-semibold">Find the Flag</div>
          <div className="text-sm text-gray-600">Click the correct flag from the grid</div>
        </Button>
        
        <Button
          variant={selectedMode === 'name-flag' ? 'default' : 'outline'}
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => onModeSelect('name-flag')}
        >
          <div className="text-2xl">📝</div>
          <div className="font-semibold">Name the Flag</div>
          <div className="text-sm text-gray-600">Choose the country name for the flag</div>
        </Button>

        <Button
          variant={selectedMode === 'population-quiz' ? 'default' : 'outline'}
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => onModeSelect('population-quiz')}
        >
          <div className="text-2xl">👥</div>
          <div className="font-semibold">Population Quiz</div>
          <div className="text-sm text-gray-600">Guess which country has the given population</div>
        </Button>

        <Button
          variant={selectedMode === 'capital-quiz' ? 'default' : 'outline'}
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => onModeSelect('capital-quiz')}
        >
          <div className="text-2xl">🏛️</div>
          <div className="font-semibold">Capital Quiz</div>
          <div className="text-sm text-gray-600">Guess which country has the given capital</div>
        </Button>
      </div>
      
      <Button 
        onClick={onStartGame}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        Start Game
      </Button>
    </Card>
  );
};

export default GameModeSelector;
