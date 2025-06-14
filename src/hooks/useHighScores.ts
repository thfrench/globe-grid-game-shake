
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerName } from './usePlayerName';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  player_name: string;
}

const localScoresKey = (gameMode: string) => `local_scores_${gameMode}`;

export const useHighScores = (gameMode: string) => {
  const { playerName, sessionId } = usePlayerName();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);
  const submittedScoresRef = useRef<Set<string>>(new Set());

  const fetchHighScores = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch global high scores - show all scores including anonymous ones
      const { data: globalData, error: globalError } = await supabase
        .from('high_scores')
        .select('*')
        .eq('game_mode', gameMode)
        .order('time_elapsed', { ascending: true })
        .limit(10);

      if (globalError) {
        console.error('Error fetching global scores:', globalError);
      } else if (globalData) {
        const transformedGlobalData = globalData.map(item => ({
          id: item.id,
          score: item.score,
          time_elapsed: item.time_elapsed,
          created_at: item.created_at,
          player_name: item.player_name || 'Anonymous'
        }));
        setGlobalScores(transformedGlobalData);
        console.log('Global scores fetched:', transformedGlobalData);
      }

      // Fetch personal scores by session ID
      const { data: personalData, error: personalError } = await supabase
        .from('high_scores')
        .select('*')
        .eq('game_mode', gameMode)
        .eq('user_id', sessionId)
        .order('time_elapsed', { ascending: true })
        .limit(5);

      if (personalError) {
        console.error('Error fetching personal scores:', personalError);
      } else if (personalData) {
        const transformedPersonalData = personalData.map(item => ({
          id: item.id,
          score: item.score,
          time_elapsed: item.time_elapsed,
          created_at: item.created_at,
          player_name: item.player_name || playerName || 'Anonymous'
        }));
        setPersonalScores(transformedPersonalData);
        console.log('Personal scores fetched:', transformedPersonalData);
      }
    } catch (error) {
      console.error('Error in fetchHighScores:', error);
    }

    setLoading(false);
  }, [gameMode, playerName, sessionId]);

  const submitScore = useCallback(async (score: number, timeElapsed: number) => {
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
      // Always submit directly to Supabase using session ID
      const { data, error } = await supabase
        .from('high_scores')
        .insert({
          game_mode: gameMode,
          score,
          time_elapsed: timeElapsed,
          player_name: playerName || null,
          user_id: sessionId // Use session ID as user_id
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
  }, [gameMode, playerName, sessionId, fetchHighScores]);

  const updatePlayerNameInScores = useCallback(async () => {
    if (!playerName || !sessionId) return;

    try {
      // Update all scores for this session with the new player name
      const { error } = await supabase
        .from('high_scores')
        .update({ player_name: playerName })
        .eq('user_id', sessionId);

      if (error) {
        console.error('Error updating player name in scores:', error);
      } else {
        console.log('Player name updated in all scores for session');
        // Refresh scores after updating
        await fetchHighScores();
      }
    } catch (error) {
      console.error('Error in updatePlayerNameInScores:', error);
    }
  }, [playerName, sessionId, fetchHighScores]);

  useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  return {
    globalScores,
    personalScores,
    loading,
    submitScore,
    updatePlayerNameInScores,
    refetch: fetchHighScores
  };
};
