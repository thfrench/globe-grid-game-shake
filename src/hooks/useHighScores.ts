
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHighScores = async () => {
    setLoading(true);

    // Fetch global high scores with proper join using the foreign key relationship
    const { data: globalData, error: globalError } = await supabase
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

    if (globalError) {
      console.error(globalError);
      toast({
        title: 'Error',
        description: 'Failed to fetch global high scores',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

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
      const { data: personalData, error: personalError } = await supabase
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

      if (personalError) {
        console.error(personalError);
        toast({
          title: 'Error',
          description: 'Failed to fetch your high scores',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

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

    if (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to submit score',
        variant: 'destructive'
      });
      return;
    }

    fetchHighScores(); // Refresh scores after submission
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
