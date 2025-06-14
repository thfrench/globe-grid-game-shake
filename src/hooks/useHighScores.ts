
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
  session_id?: string;
  player_name?: string;
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

    // Get personal scores based on session ID
    const raw = localStorage.getItem(localScoresKey(gameMode));
    if (raw) {
      const data: LocalScoreData[] = JSON.parse(raw);
      // Filter scores by session ID and ensure they have the current player name
      const sessionScores = data
        .filter(score => score.session_id === sessionId || !score.session_id) // Include scores without session_id for backwards compatibility
        .map(score => ({
          ...score,
          player_name: playerName || 'Anonymous' // Always use current player name
        }))
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
          player_name: s.player_name || playerName || 'Anonymous'
        }));
      setPersonalScores(sessionScores);
    } else {
      setPersonalScores([]);
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
          submittedScoresRef.current.delete(scoreKey);
          return;
        }
      }

      // Always save to local storage with session ID
      const localDataRaw = localStorage.getItem(localScoresKey(gameMode));
      const localData: LocalScoreData[] = localDataRaw ? JSON.parse(localDataRaw) : [];
      
      // Check if this exact score already exists for this session
      const exists = localData.find(item => 
        item.time_elapsed === timeElapsed && 
        item.score === score &&
        (item.session_id === sessionId || !item.session_id)
      );
      
      if (!exists) {
        localData.push({ 
          score, 
          time_elapsed: timeElapsed, 
          created_at: new Date().toISOString(),
          session_id: sessionId,
          player_name: playerName
        });
        localStorage.setItem(localScoresKey(gameMode), JSON.stringify(localData));
      }
      
      // Refresh scores after successful submission
      fetchHighScores();
    } catch (error) {
      console.error('Error in submitScore:', error);
      submittedScoresRef.current.delete(scoreKey);
    }
  }, [gameMode, playerName, sessionId, fetchHighScores]);

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
