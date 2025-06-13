
import React, { useState, useEffect, useCallback } from 'react';
import FlagCard from './FlagCard';
import GameHeader from './GameHeader';
import GameModeSelector, { GameMode } from './GameModeSelector';
import NameFlagGame from './NameFlagGame';
import CapitalGame from './CapitalGame';
import { Card } from '@/components/ui/card';
import { countries, Country } from '../data/countries';
import { shuffleArray } from '../utils/gameUtils';

const FlagGame = () => {
  const [gameMode, setGameMode] = useState<GameMode>('find-flag');
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [gameFlags, setGameFlags] = useState<Country[]>([]);
  const [currentTarget, setCurrentTarget] = useState<Country | null>(null);
  const [flippedFlags, setFlippedFlags] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [shakingFlag, setShakingFlag] = useState<string | null>(null);

  const selectNewTarget = useCallback((excludedCode?: string) => {
    const remainingFlags = gameFlags.filter(flag => 
      !flippedFlags.has(flag.code) && flag.code !== excludedCode
    );
    
    if (remainingFlags.length === 0) {
      setGameComplete(true);
      setIsGameActive(false);
      return;
    }
    
    const randomTarget = remainingFlags[Math.floor(Math.random() * remainingFlags.length)];
    setCurrentTarget(randomTarget);
  }, [gameFlags, flippedFlags]);

  const initializeFindFlagGame = useCallback(() => {
    const shuffledCountries = shuffleArray(countries);
    const selectedFlags = shuffledCountries.slice(0, 25);
    setGameFlags(selectedFlags);
    
    const randomTarget = selectedFlags[Math.floor(Math.random() * selectedFlags.length)];
    setCurrentTarget(randomTarget);
    
    setFlippedFlags(new Set());
    setTimeElapsed(0);
    setIsGameActive(true);
    setGameComplete(false);
    setShakingFlag(null);
    setShowModeSelector(false);
  }, []);

  const handleFlagClick = (country: Country) => {
    if (!isGameActive || flippedFlags.has(country.code)) return;

    if (country.code === currentTarget?.code) {
      const newFlippedFlags = new Set(flippedFlags);
      newFlippedFlags.add(country.code);
      setFlippedFlags(newFlippedFlags);
      
      setTimeout(() => {
        selectNewTarget(country.code);
      }, 300);
    } else {
      setTimeElapsed(prev => prev + 5);
      setShakingFlag(country.code);
      setTimeout(() => setShakingFlag(null), 600);
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
  };

  const handleStartGame = () => {
    if (gameMode === 'find-flag') {
      initializeFindFlagGame();
    } else {
      setShowModeSelector(false);
    }
  };

  const handleBackToMenu = () => {
    setShowModeSelector(true);
    setIsGameActive(false);
    setGameComplete(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && gameMode === 'find-flag') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameMode]);

  if (showModeSelector) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <GameModeSelector
          selectedMode={gameMode}
          onModeSelect={handleModeSelect}
          onStartGame={handleStartGame}
        />
      </div>
    );
  }

  if (gameMode === 'name-flag') {
    return <NameFlagGame onBackToMenu={handleBackToMenu} />;
  }

  if (gameMode === 'capital-quiz') {
    return <CapitalGame onBackToMenu={handleBackToMenu} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GameHeader
        timeElapsed={timeElapsed}
        onBackToMenu={handleBackToMenu}
        onNewGame={initializeFindFlagGame}
      />

      <div className="grid grid-cols-5 gap-4 mb-6">
        {gameFlags.map((country) => (
          <FlagCard
            key={country.code}
            country={country}
            isFlipped={flippedFlags.has(country.code)}
            isShaking={shakingFlag === country.code}
            onClick={() => handleFlagClick(country)}
          />
        ))}
      </div>

      <Card className="p-6 text-center bg-white/80 backdrop-blur-sm">
        {gameComplete ? (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</h2>
            <p className="text-lg text-gray-700">
              You completed the game in {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}!
            </p>
          </div>
        ) : currentTarget ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Find the flag of:</h2>
            <p className="text-2xl font-bold text-blue-600">{currentTarget.name}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default FlagGame;
