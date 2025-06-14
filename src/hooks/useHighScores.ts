
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerName } from './usePlayerName';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  player_name: string;
}

interface LocalScoreData {
  score: number;
  time_elapsed: number;
  created_at: string;
}

const localScoresKey = (gameMode: string) => `local_scores_${gameMode}`;

export const useHighScores = (gameMode: string) => {
  const { playerName } = usePlayerName();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHighScores = useCallback(async () => {
    setLoading(true);
    
    // Fetch global high scores
    const { data: globalData } = await supabase
      .from('high_scores')
      .select('*')
      .eq('game_mode', gameMode)
      .order('time_elapsed', { ascending: true })
      .limit(10);

    if (globalData) {
      const transformedGlobalData = globalData.map(item => ({
        id: item.id,
        score: item.score,
        time_elapsed: item.time_elapsed,
        created_at: item.created_at,
        player_name: item.player_name || 'Anonymous'
      }));
      setGlobalScores(transformedGlobalData);
    }

    // Fetch personal high scores based on player name
    if (playerName) {
      const { data: personalData } = await supabase
        .from('high_scores')
        .select('*')
        .eq('game_mode', gameMode)
        .eq('player_name', playerName)
        .order('time_elapsed', { ascending: true })
        .limit(5);

      if (personalData) {
        const transformedPersonalData = personalData.map(item => ({
          id: item.id,
          score: item.score,
          time_elapsed: item.time_elapsed,
          created_at: item.created_at,
          player_name: item.player_name || 'Anonymous'
        }));
        setPersonalScores(transformedPersonalData);
      }
    } else {
      // Fall back to local storage for personal scores
      const raw = localStorage.getItem(localScoresKey(gameMode));
      if (raw) {
        const data: LocalScoreData[] = JSON.parse(raw);
        const mapped = data
          .sort((a, b) => a.time_elapsed - b.time_elapsed)
          .slice(0, 5)
          .map((s, index) => ({
            id: index.toString(),
            score: s.score,
            time_elapsed: s.time_elapsed,
            created_at: s.created_at,
            player_name: 'Anonymous'
          }));
        setPersonalScores(mapped);
      } else {
        setPersonalScores([]);
      }
    }

    setLoading(false);
  }, [gameMode, playerName]);

  const submitScore = async (score: number, timeElapsed: number) => {
    // Always save to local storage as backup
    const localDataRaw = localStorage.getItem(localScoresKey(gameMode));
    const localData: LocalScoreData[] = localDataRaw ? JSON.parse(localDataRaw) : [];
    localData.push({ score, time_elapsed: timeElapsed, created_at: new Date().toISOString() });
    localStorage.setItem(localScoresKey(gameMode), JSON.stringify(localData));

    // If player has a name, save to Supabase
    if (playerName) {
      const { error } = await supabase
        .from('high_scores')
        .insert({
          game_mode: gameMode,
          score,
          time_elapsed: timeElapsed,
          player_name: playerName
        });

      if (!error) {
        fetchHighScores(); // Refresh scores after submission
      }
    } else {
      fetchHighScores();
    }
  };

  useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  return {
    globalScores,
    personalScores,
    loading,
    submitScore,
    refetch: fetchHighScores
  };
};
