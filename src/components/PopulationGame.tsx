
import React, { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Country {
  name: string;
  flag: string;
  code: string;
  population: number;
}

const countries: Country[] = [
  { name: 'United States', flag: '🇺🇸', code: 'US', population: 331900000 },
  { name: 'Canada', flag: '🇨🇦', code: 'CA', population: 38000000 },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', population: 67000000 },
  { name: 'France', flag: '🇫🇷', code: 'FR', population: 68000000 },
  { name: 'Germany', flag: '🇩🇪', code: 'DE', population: 83200000 },
  { name: 'Italy', flag: '🇮🇹', code: 'IT', population: 59100000 },
  { name: 'Spain', flag: '🇪🇸', code: 'ES', population: 47400000 },
  { name: 'Japan', flag: '🇯🇵', code: 'JP', population: 125000000 },
  { name: 'China', flag: '🇨🇳', code: 'CN', population: 1412000000 },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR', population: 215000000 },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', population: 25700000 },
  { name: 'India', flag: '🇮🇳', code: 'IN', population: 1380000000 },
  { name: 'Russia', flag: '🇷🇺', code: 'RU', population: 146000000 },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX', population: 128900000 },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR', population: 51800000 },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL', population: 17400000 },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE', population: 10400000 },
  { name: 'Norway', flag: '🇳🇴', code: 'NO', population: 5400000 },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH', population: 8700000 },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR', population: 45400000 },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA', population: 60400000 },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG', population: 104000000 },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR', population: 84300000 },
  { name: 'Greece', flag: '🇬🇷', code: 'GR', population: 10700000 },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT', population: 10300000 },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE', population: 11600000 },
  { name: 'Denmark', flag: '🇩🇰', code: 'DK', population: 5800000 },
  { name: 'Finland', flag: '🇫🇮', code: 'FI', population: 5500000 },
  { name: 'Poland', flag: '🇵🇱', code: 'PL', population: 38000000 },
  { name: 'Thailand', flag: '🇹🇭', code: 'TH', population: 70000000 }
];

interface PopulationGameProps {
  onBackToMenu: () => void;
}

const PopulationGame: React.FC<PopulationGameProps> = ({ onBackToMenu }) => {
  const [gameCountries, setGameCountries] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
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

  const formatPopulation = (population: number) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)} billion`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)} million`;
    } else {
      return population.toLocaleString();
    }
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
    setCurrentCountry(firstCountry);
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

    if (option.code === currentCountry?.code) {
      // Correct answer
      setSelectedOption(option.code);
      
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= gameCountries.length) {
          setGameComplete(true);
          setIsGameActive(false);
        } else {
          const nextCountry = gameCountries[nextIndex];
          setCurrentCountry(nextCountry);
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
    return 'bg-white hover:bg-gray-50 border-gray-300 text-black';
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
      ) : currentCountry ? (
        <div className="space-y-6">
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Which country has a population of:</h2>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatPopulation(currentCountry.population)}
            </div>
            <div className="text-sm text-gray-600">people?</div>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {options.map((option) => (
              <Button
                key={option.code}
                onClick={() => handleOptionClick(option)}
                className={`h-auto p-4 text-lg font-medium border-2 transition-all duration-200 ${getButtonStyle(option)}`}
                disabled={selectedOption !== null || incorrectOptions.has(option.code)}
              >
                <span className="mr-3">{option.flag}</span>
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PopulationGame;
