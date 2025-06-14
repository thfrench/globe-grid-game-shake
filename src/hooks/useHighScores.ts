
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  user_id: string;
  game_mode: string;
  profiles?: {
    display_name: string | null;
  } | null;
}

export const useHighScores = (gameMode: string) => {
  const { user } = useAuth();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);
  const submittedScoresRef = useRef<Set<string>>(new Set());

  const fetchHighScores = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch global high scores with profile information
      const { data: globalData, error: globalError } = await supabase
        .from('high_scores')
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .eq('game_mode', gameMode)
        .order('time_elapsed', { ascending: true })
        .limit(10);

      if (globalError) {
        console.error('Error fetching global scores:', globalError);
      } else if (globalData) {
        setGlobalScores(globalData as HighScore[]);
        console.log('Global scores fetched:', globalData);
      }

      // Fetch personal scores if user is logged in
      if (user) {
        const { data: personalData, error: personalError } = await supabase
          .from('high_scores')
          .select(`
            *,
            profiles (
              display_name
            )
          `)
          .eq('game_mode', gameMode)
          .eq('user_id', user.id)
          .order('time_elapsed', { ascending: true })
          .limit(5);

        if (personalError) {
          console.error('Error fetching personal scores:', personalError);
        } else if (personalData) {
          setPersonalScores(personalData as HighScore[]);
          console.log('Personal scores fetched:', personalData);
        }
      } else {
        setPersonalScores([]);
      }
    } catch (error) {
      console.error('Error in fetchHighScores:', error);
    }

    setLoading(false);
  }, [gameMode, user]);

  const submitScore = useCallback(async (score: number, timeElapsed: number) => {
    if (!user) {
      console.log('User not authenticated, cannot submit score');
      return;
    }

    // Create a unique key for this score submission to prevent duplicates
    const scoreKey = `${gameMode}-${score}-${timeElapsed}-${Date.now()}`;
    
    // Check if we've already submitted this exact score
    if (submittedScoresRef.current.has(scoreKey)) {
      console.log('Score already submitted, skipping...');
      return;
    }

    // Mark this score as submitted
    submittedScoresRef.current.add(scoreKey);

    try {
      console.log('Submitting score for user:', user.id);
      
      const { data, error } = await supabase
        .from('high_scores')
        .insert({
          game_mode: gameMode,
          score,
          time_elapsed: timeElapsed,
          user_id: user.id
        })
        .select();

      if (error) {
        console.error('Error submitting score to Supabase:', error);
        throw error;
      } else {
        console.log('Score successfully submitted to Supabase:', data);
      }
      
      // Refresh scores after successful submission
      await fetchHighScores();
    } catch (error) {
      console.error('Error in submitScore:', error);
      submittedScoresRef.current.delete(scoreKey);
    }
  }, [gameMode, user, fetchHighScores]);

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
