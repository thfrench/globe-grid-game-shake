
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
    
    // Fetch global high scores with proper join
    const { data: globalData } = await supabase
      .from('high_scores')
      .select(`
        id,
        score,
        time_elapsed,
        created_at,
        user_id,
        profiles!high_scores_user_id_fkey(display_name)
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
          profiles!high_scores_user_id_fkey(display_name)
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
