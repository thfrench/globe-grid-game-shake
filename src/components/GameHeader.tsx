
import React from 'react';
import Timer from './Timer';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  timeElapsed: number;
  currentQuestion?: number;
  totalQuestions?: number;
  onBackToMenu: () => void;
  onNewGame?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  timeElapsed,
  currentQuestion,
  totalQuestions,
  onBackToMenu,
  onNewGame
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Timer timeElapsed={timeElapsed} />
      {currentQuestion !== undefined && totalQuestions && (
        <div className="text-lg font-semibold text-gray-700">
          {currentQuestion + 1} / {totalQuestions}
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={onBackToMenu} variant="outline">
          Back to Menu
        </Button>
        {onNewGame && (
          <Button 
            onClick={onNewGame}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            New Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameHeader;
