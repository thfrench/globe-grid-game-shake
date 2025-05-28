
import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './GameHeader';
import GameCompletion from './GameCompletion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { countries, Country } from '../data/countries';
import { shuffleArray, generateOptions } from '../utils/gameUtils';

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

  const initializeGame = useCallback(() => {
    const shuffledCountries = shuffleArray(countries);
    const selectedCountries = shuffledCountries.slice(0, 25);
    setGameCountries(selectedCountries);
    
    const firstCountry = selectedCountries[0];
    setCurrentFlag(firstCountry);
    setOptions(generateOptions(firstCountry, countries));
    
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIncorrectOptions(new Set());
    setTimeElapsed(0);
    setIsGameActive(true);
    setGameComplete(false);
  }, []);

  const handleOptionClick = (option: Country) => {
    if (selectedOption || incorrectOptions.has(option.code)) return;

    if (option.code === currentFlag?.code) {
      setSelectedOption(option.code);
      
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= gameCountries.length) {
          setGameComplete(true);
          setIsGameActive(false);
        } else {
          const nextCountry = gameCountries[nextIndex];
          setCurrentFlag(nextCountry);
          setOptions(generateOptions(nextCountry, countries));
          setCurrentQuestionIndex(nextIndex);
          setSelectedOption(null);
          setIncorrectOptions(new Set());
        }
      }, 1000);
    } else {
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
      <GameHeader
        timeElapsed={timeElapsed}
        currentQuestion={currentQuestionIndex}
        totalQuestions={25}
        onBackToMenu={onBackToMenu}
      />

      {gameComplete ? (
        <GameCompletion
          timeElapsed={timeElapsed}
          onPlayAgain={initializeGame}
          onBackToMenu={onBackToMenu}
        />
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
