
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayerName } from './usePlayerName';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

interface LocalScoreData {
  score: number;
  time_elapsed: number;
  created_at: string;
}

const localScoresKey = (gameMode: string) => `local_scores_${gameMode}`;

export const useHighScores = (gameMode: string) => {
  const { user } = useAuth();
  const { playerName } = usePlayerName();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHighScores = useCallback(async () => {
    setLoading(true);
    
    // Fetch global high scores with proper join using the foreign key relationship
    const { data: globalData } = await supabase
      .from('high_scores')
      .select(`
        id,
        score,
        time_elapsed,
        created_at,
        user_id,
        profiles!fk_high_scores_user_id(display_name)
      `)
      .eq('game_mode', gameMode)
      .order('time_elapsed', { ascending: true })
      .limit(10);

    if (globalData) {
      // Transform the data to match our interface
      const transformedGlobalData = globalData.map(item => ({
        id: item.id,
        score: item.score,
        time_elapsed: item.time_elapsed,
        created_at: item.created_at,
        profiles: {
          display_name: item.profiles?.display_name || 'Anonymous'
        }
      }));
      setGlobalScores(transformedGlobalData);
    }

    // Fetch personal high scores if user is logged in
    if (user) {
      const { data: personalData } = await supabase
        .from('high_scores')
        .select(`
          id,
          score,
          time_elapsed,
          created_at,
          user_id,
          profiles!fk_high_scores_user_id(display_name)
        `)
        .eq('game_mode', gameMode)
        .eq('user_id', user.id)
        .order('time_elapsed', { ascending: true })
        .limit(5);

      if (personalData) {
        // Transform the data to match our interface
        const transformedPersonalData = personalData.map(item => ({
          id: item.id,
          score: item.score,
          time_elapsed: item.time_elapsed,
          created_at: item.created_at,
          profiles: {
            display_name: item.profiles?.display_name || 'Anonymous'
          }
        }));
        setPersonalScores(transformedPersonalData);
      }
    } else {
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
            profiles: { display_name: playerName || 'Anonymous' }
          }));
        setPersonalScores(mapped);
      } else {
        setPersonalScores([]);
      }
    }

    setLoading(false);
  }, [gameMode, user, playerName]);

  const submitScore = async (score: number, timeElapsed: number) => {
    const localDataRaw = localStorage.getItem(localScoresKey(gameMode));
    const localData: LocalScoreData[] = localDataRaw ? JSON.parse(localDataRaw) : [];
    localData.push({ score, time_elapsed: timeElapsed, created_at: new Date().toISOString() });
    localStorage.setItem(localScoresKey(gameMode), JSON.stringify(localData));

    if (!user) {
      fetchHighScores();
      return;
    }

    const { error } = await supabase
      .from('high_scores')
      .insert({
        user_id: user.id,
        game_mode: gameMode,
        score,
        time_elapsed: timeElapsed
      });

    if (!error) {
      fetchHighScores(); // Refresh scores after submission
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
