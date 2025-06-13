
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

export const useHighScores = (gameMode: string) => {
  const { user } = useAuth();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHighScores = async () => {
    setLoading(true);
    
    // Fetch global high scores
    const { data: globalData } = await supabase
      .from('high_scores')
      .select(`
        id,
        score,
        time_elapsed,
        created_at,
        profiles!inner(display_name)
      `)
      .eq('game_mode', gameMode)
      .order('time_elapsed', { ascending: true })
      .limit(10);

    if (globalData) {
      setGlobalScores(globalData);
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
          profiles!inner(display_name)
        `)
        .eq('game_mode', gameMode)
        .eq('user_id', user.id)
        .order('time_elapsed', { ascending: true })
        .limit(5);

      if (personalData) {
        setPersonalScores(personalData);
      }
    }

    setLoading(false);
  };

  const submitScore = async (score: number, timeElapsed: number) => {
    if (!user) return;

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
  }, [gameMode, user]);

  return {
    globalScores,
    personalScores,
    loading,
    submitScore,
    refetch: fetchHighScores
  };
};
