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
      // Fall back to local storage for personal scores - remove duplicates
      const raw = localStorage.getItem(localScoresKey(gameMode));
      if (raw) {
        const data: LocalScoreData[] = JSON.parse(raw);
        // Remove duplicates and get unique scores by time_elapsed, keep best ones
        const uniqueScores = data
          .sort((a, b) => a.time_elapsed - b.time_elapsed)
          .reduce((acc: LocalScoreData[], current) => {
            const exists = acc.find(item => item.time_elapsed === current.time_elapsed);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, [])
          .slice(0, 5)
          .map((s, index) => ({
            id: index.toString(),
            score: s.score,
            time_elapsed: s.time_elapsed,
            created_at: s.created_at,
            player_name: 'Anonymous'
          }));
        setPersonalScores(uniqueScores);
      } else {
        setPersonalScores([]);
      }
    }

    setLoading(false);
  }, [gameMode, playerName]);

  const submitScore = async (score: number, timeElapsed: number) => {
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
      // Save to local storage as backup - avoid duplicates
      const localDataRaw = localStorage.getItem(localScoresKey(gameMode));
      const localData: LocalScoreData[] = localDataRaw ? JSON.parse(localDataRaw) : [];
      
      // Check if this exact score already exists
      const exists = localData.find(item => 
        item.time_elapsed === timeElapsed && 
        item.score === score
      );
      
      if (!exists) {
        localData.push({ score, time_elapsed: timeElapsed, created_at: new Date().toISOString() });
        localStorage.setItem(localScoresKey(gameMode), JSON.stringify(localData));
      }
      
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
