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
  const submittedScoresRef = useRef<Set<string>>(new Set());

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

    // Always use local storage for personal scores to avoid name-based filtering issues
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
          player_name: playerName || 'Anonymous'
        }));
      setPersonalScores(uniqueScores);
    } else {
      setPersonalScores([]);
    }

    setLoading(false);
  }, [gameMode, playerName]);

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

        if (error) {
          console.error('Error submitting score:', error);
          // Remove from submitted set if there was an error
          submittedScoresRef.current.delete(scoreKey);
          return;
        }
      }

      // Always save to local storage as well (for personal scores tracking)
      const localDataRaw = localStorage.getItem(localScoresKey(gameMode));
      const localData: LocalScoreData[] = localDataRaw ? JSON.parse(localDataRaw) : [];
      
      // Check if this exact score already exists in local storage
      const exists = localData.find(item => 
        item.time_elapsed === timeElapsed && 
        item.score === score
      );
      
      if (!exists) {
        localData.push({ score, time_elapsed: timeElapsed, created_at: new Date().toISOString() });
        localStorage.setItem(localScoresKey(gameMode), JSON.stringify(localData));
      }
      
      // Refresh scores after successful submission
      fetchHighScores();
    } catch (error) {
      console.error('Error in submitScore:', error);
      // Remove from submitted set if there was an error
      submittedScoresRef.current.delete(scoreKey);
    }
  }, [gameMode, playerName, fetchHighScores]);

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
