
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTime } from '../utils/gameUtils';
import { useHighScores } from '@/hooks/useHighScores';
import { useAuth } from '@/contexts/AuthContext';

interface GameCompletionProps {
  timeElapsed: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  gameMode: string;
  score?: number;
}

const GameCompletion: React.FC<GameCompletionProps> = ({
  timeElapsed,
  onPlayAgain,
  onBackToMenu,
  gameMode,
  score = 25
}) => {
  const { user } = useAuth();
  const { submitScore } = useHighScores(gameMode);

  useEffect(() => {
    if (user) {
      submitScore(score, timeElapsed);
    }
  }, [user, score, timeElapsed, submitScore]);

  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
      <p className="text-xl text-gray-700 mb-4">
        You completed the game in {formatTime(timeElapsed)}!
      </p>
      {user ? (
        <p className="text-sm text-gray-600 mb-4">Your score has been saved!</p>
      ) : (
        <p className="text-sm text-gray-600 mb-4">Sign in to save your high scores!</p>
      )}
      <Button 
        onClick={onPlayAgain}
        className="bg-blue-600 hover:bg-blue-700 text-white mr-4"
      >
        Play Again
      </Button>
      <Button 
        onClick={onBackToMenu}
        variant="outline"
      >
        Back to Menu
      </Button>
    </Card>
  );
};

export default GameCompletion;
