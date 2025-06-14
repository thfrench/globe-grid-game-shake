
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTime } from '../utils/gameUtils';
import { useHighScores } from '@/hooks/useHighScores';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

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
  const { profile } = useProfile();
  const { submitScore } = useHighScores(gameMode);
  const scoreSubmittedRef = useRef(false);

  useEffect(() => {
    // Only submit score if user is authenticated
    if (user && !scoreSubmittedRef.current) {
      scoreSubmittedRef.current = true;
      console.log('Submitting score for authenticated user');
      submitScore(score, timeElapsed);
    }
  }, [submitScore, score, timeElapsed, user]);

  if (!user) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
        <p className="text-xl text-gray-700 mb-4">
          You completed the game in {formatTime(timeElapsed)}!
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Sign in with Google to save your score to the leaderboard!
        </p>
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
  }

  const displayName = profile?.display_name || 'Anonymous';

  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
      <p className="text-xl text-gray-700 mb-4">
        You completed the game in {formatTime(timeElapsed)}!
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Your score has been saved as {displayName}!
      </p>
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
