
import React, { useState, useEffect, useCallback } from 'react';
import FlagCard from './FlagCard';
import Timer from './Timer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Country {
  name: string;
  flag: string;
  code: string;
}

const countries: Country[] = [
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { name: 'China', flag: '🇨🇳', code: 'CN' },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'India', flag: '🇮🇳', code: 'IN' },
  { name: 'Russia', flag: '🇷🇺', code: 'RU' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
  { name: 'Norway', flag: '🇳🇴', code: 'NO' },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
  { name: 'Greece', flag: '🇬🇷', code: 'GR' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
  { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
  { name: 'Finland', flag: '🇫🇮', code: 'FI' },
  { name: 'Poland', flag: '🇵🇱', code: 'PL' },
  { name: 'Thailand', flag: '🇹🇭', code: 'TH' }
];

const FlagGame = () => {
  const [gameFlags, setGameFlags] = useState<Country[]>([]);
  const [currentTarget, setCurrentTarget] = useState<Country | null>(null);
  const [flippedFlags, setFlippedFlags] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [shakingFlag, setShakingFlag] = useState<string | null>(null);

  const shuffleArray = (array: Country[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = useCallback(() => {
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
  }, []);

  const selectNewTarget = useCallback(() => {
    if (flippedFlags.size >= gameFlags.length) {
      setGameComplete(true);
      setIsGameActive(false);
      return;
    }
    
    // Select any random flag from the game, not just unflipped ones
    const randomTarget = gameFlags[Math.floor(Math.random() * gameFlags.length)];
    setCurrentTarget(randomTarget);
  }, [gameFlags, flippedFlags.size]);

  const handleFlagClick = (country: Country) => {
    if (!isGameActive) return;

    if (country.code === currentTarget?.code) {
      // Correct answer
      const newFlippedFlags = new Set(flippedFlags);
      newFlippedFlags.add(country.code);
      setFlippedFlags(newFlippedFlags);
      
      // Select new target after a short delay
      setTimeout(() => {
        selectNewTarget();
      }, 500);
    } else {
      // Wrong answer - add penalty time and shake
      setTimeElapsed(prev => prev + 5);
      setShakingFlag(country.code);
      setTimeout(() => setShakingFlag(null), 600);
    }
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Timer timeElapsed={timeElapsed} />
        <Button 
          onClick={initializeGame}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          New Game
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
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
