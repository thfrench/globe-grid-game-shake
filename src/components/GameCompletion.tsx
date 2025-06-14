
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatTime } from '../utils/gameUtils';
import { useHighScores } from '@/hooks/useHighScores';
import { usePlayerName } from '@/hooks/usePlayerName';

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
  const { playerName, setPlayerName } = usePlayerName();
  const { submitScore } = useHighScores(gameMode);
  const [nameInput, setNameInput] = useState(playerName);

  useEffect(() => {
    if (playerName) {
      submitScore(score, timeElapsed);
    }
  }, [playerName, score, timeElapsed, submitScore]);

  return (
    <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
      <p className="text-xl text-gray-700 mb-4">
        You completed the game in {formatTime(timeElapsed)}!
      </p>
      {playerName ? (
        <p className="text-sm text-gray-600 mb-4">Your score has been saved!</p>
      ) : (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600">Enter your name to save scores:</p>
          <div className="flex items-center gap-2 justify-center">
            <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-40" />
            <Button size="sm" onClick={() => setPlayerName(nameInput)}>
              Save
            </Button>
          </div>
        </div>
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
