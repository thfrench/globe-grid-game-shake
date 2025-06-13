import { useState, useEffect, useCallback } from 'react';
import { usePlayerName } from './usePlayerName';

export interface HighScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  player_name: string;
}

interface StoredScore {
  id: string;
  score: number;
  time_elapsed: number;
  created_at: string;
  player_name: string;
}

const globalKey = (mode: string) => `global_scores_${mode}`;
const personalKey = (mode: string, name: string) => `personal_scores_${mode}_${name}`;

export const useHighScores = (gameMode: string) => {
  const { playerName } = usePlayerName();
  const [globalScores, setGlobalScores] = useState<HighScore[]>([]);
  const [personalScores, setPersonalScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHighScores = useCallback(() => {
    setLoading(true);

    const globalRaw = localStorage.getItem(globalKey(gameMode));
    if (globalRaw) {
      const data: StoredScore[] = JSON.parse(globalRaw);
      data.sort((a, b) => a.time_elapsed - b.time_elapsed);
      setGlobalScores(data.slice(0, 5));
    } else {
      setGlobalScores([]);
    }

    if (playerName) {
      const personalRaw = localStorage.getItem(personalKey(gameMode, playerName));
      if (personalRaw) {
        const data: StoredScore[] = JSON.parse(personalRaw);
        data.sort((a, b) => a.time_elapsed - b.time_elapsed);
        setPersonalScores(data.slice(0, 5));
      } else {
        setPersonalScores([]);
      }
    } else {
      setPersonalScores([]);
    }

    setLoading(false);
  }, [gameMode, playerName]);

  const submitScore = useCallback(
    (score: number, timeElapsed: number) => {
      if (!playerName) return;

      const newEntry: StoredScore = {
        id: crypto.randomUUID(),
        score,
        time_elapsed: timeElapsed,
        created_at: new Date().toISOString(),
        player_name: playerName,
      };

      const globalRaw = localStorage.getItem(globalKey(gameMode));
      const globalData: StoredScore[] = globalRaw ? JSON.parse(globalRaw) : [];
      globalData.push(newEntry);
      localStorage.setItem(globalKey(gameMode), JSON.stringify(globalData));

      const personalRaw = localStorage.getItem(personalKey(gameMode, playerName));
      const personalData: StoredScore[] = personalRaw ? JSON.parse(personalRaw) : [];
      personalData.push(newEntry);
      localStorage.setItem(personalKey(gameMode, playerName), JSON.stringify(personalData));

      fetchHighScores();
    },
    [gameMode, playerName, fetchHighScores]
  );

  useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  return {
    globalScores,
    personalScores,
    loading,
    submitScore,
    refetch: fetchHighScores,
  };
};
