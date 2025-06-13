
import React from 'react';
import Timer from './Timer';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  timeElapsed: number;
  currentQuestion?: number;
  totalQuestions?: number;
  onBackToMenu: () => void;
  onNewGame?: () => void;
  feedback?: 'correct' | 'incorrect' | null;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  timeElapsed,
  currentQuestion,
  totalQuestions,
  onBackToMenu,
  onNewGame,
  feedback
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Timer timeElapsed={timeElapsed} />
      <div className="flex items-center gap-4">
        {currentQuestion !== undefined && totalQuestions && (
          <div className="text-lg font-semibold text-gray-700">
            {currentQuestion + 1} / {totalQuestions}
          </div>
        )}
        {feedback && (
          <div className={`text-lg font-bold animate-fade-in ${
            feedback === 'correct' ? 'text-green-600' : 'text-red-600'
          }`}>
            {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
          </div>
        )}
      </div>
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
