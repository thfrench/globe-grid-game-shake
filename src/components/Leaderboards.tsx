import React from 'react';
import { Card } from '@/components/ui/card';
import { useHighScores } from '@/hooks/useHighScores';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/utils/gameUtils';
import { GameMode } from './GameModeSelector';

interface LeaderboardsProps {
  gameMode: GameMode;
}

const Leaderboards: React.FC<LeaderboardsProps> = ({ gameMode }) => {
  const { user } = useAuth();
  const { globalScores, personalScores, loading } = useHighScores(gameMode);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl">
        <h4 className="font-semibold text-gray-800 mb-3 text-center">🌍 Global High Scores</h4>
        {loading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : globalScores.length > 0 ? (
          <div className="space-y-1 text-sm">
            {globalScores.slice(0, 5).map((score, index) => (
              <div key={score.id} className="flex justify-between">
                <span>{index + 1}. {score.profiles.display_name || 'Anonymous'}</span>
                <span className="font-mono">{formatTime(score.time_elapsed)}</span>
              </div>
            ))}
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
            Sign in with Google to track your scores!
          </div>
        ) : loading ? (
          <div className="text-center text-sm text-gray-500">Loading...</div>
        ) : personalScores.length > 0 ? (
          <div className="space-y-1 text-sm">
            {personalScores.slice(0, 5).map((score, index) => (
              <div key={score.id} className="flex justify-between">
                <span>{index + 1}. Your best</span>
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
  );
};

export default Leaderboards;
