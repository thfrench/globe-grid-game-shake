
import React, { useState, useEffect, useCallback } from 'react';
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

interface NameFlagGameProps {
  onBackToMenu: () => void;
}

const NameFlagGame: React.FC<NameFlagGameProps> = ({ onBackToMenu }) => {
  const [gameCountries, setGameCountries] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentFlag, setCurrentFlag] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [incorrectOptions, setIncorrectOptions] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const shuffleArray = (array: Country[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateOptions = useCallback((correctCountry: Country) => {
    const otherCountries = countries.filter(c => c.code !== correctCountry.code);
    const shuffledOthers = shuffleArray(otherCountries);
    const wrongOptions = shuffledOthers.slice(0, 2);
    const allOptions = [correctCountry, ...wrongOptions];
    return shuffleArray(allOptions);
  }, []);

  const initializeGame = useCallback(() => {
    const shuffledCountries = shuffleArray(countries);
    const selectedCountries = shuffledCountries.slice(0, 25);
    setGameCountries(selectedCountries);
    
    const firstCountry = selectedCountries[0];
    setCurrentFlag(firstCountry);
    setOptions(generateOptions(firstCountry));
    
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIncorrectOptions(new Set());
    setTimeElapsed(0);
    setIsGameActive(true);
    setGameComplete(false);
  }, [generateOptions]);

  const handleOptionClick = (option: Country) => {
    if (selectedOption || incorrectOptions.has(option.code)) return;

    if (option.code === currentFlag?.code) {
      // Correct answer
      setSelectedOption(option.code);
      
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= gameCountries.length) {
          setGameComplete(true);
          setIsGameActive(false);
        } else {
          const nextCountry = gameCountries[nextIndex];
          setCurrentFlag(nextCountry);
          setOptions(generateOptions(nextCountry));
          setCurrentQuestionIndex(nextIndex);
          setSelectedOption(null);
          setIncorrectOptions(new Set());
        }
      }, 1000);
    } else {
      // Wrong answer
      setTimeElapsed(prev => prev + 5);
      setIncorrectOptions(prev => new Set([...prev, option.code]));
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

  const getButtonStyle = (option: Country) => {
    if (selectedOption === option.code) {
      return 'bg-green-500 text-white border-green-600';
    }
    if (incorrectOptions.has(option.code)) {
      return 'bg-red-500 text-white border-red-600 cursor-not-allowed';
    }
    return 'bg-white hover:bg-gray-50 border-gray-300';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Timer timeElapsed={timeElapsed} />
        <div className="text-lg font-semibold text-gray-700">
          {currentQuestionIndex + 1} / 25
        </div>
        <Button 
          onClick={onBackToMenu}
          variant="outline"
        >
          Back to Menu
        </Button>
      </div>

      {gameComplete ? (
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h2>
          <p className="text-xl text-gray-700 mb-4">
            You completed the game in {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}!
          </p>
          <Button 
            onClick={initializeGame}
            className="bg-blue-600 hover:bg-blue-700 text-white mr-4"
          >
            Play Again
          </Button>
          <Button 
            onClick={onBackToMenu}
            variant="outline"
          >
            Back to Menu
          </Button>
        </Card>
      ) : currentFlag ? (
        <div className="space-y-6">
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What country is this flag from?</h2>
            <div className="text-8xl mb-6">{currentFlag.flag}</div>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {options.map((option) => (
              <Button
                key={option.code}
                onClick={() => handleOptionClick(option)}
                className={`h-auto p-4 text-lg font-medium border-2 transition-all duration-200 ${getButtonStyle(option)}`}
                disabled={selectedOption !== null || incorrectOptions.has(option.code)}
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NameFlagGame;
