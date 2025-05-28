
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameHeader from './GameHeader';
import GameCompletion from './GameCompletion';
import { countries, Country } from '../data/countries';
import { shuffleArray, generateOptions } from '../utils/gameUtils';

interface CapitalGameProps {
  onBackToMenu: () => void;
}

const CapitalGame: React.FC<CapitalGameProps> = ({ onBackToMenu }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<Country[]>([]);
  const [currentOptions, setCurrentOptions] = useState<Country[]>([]);

  const totalQuestions = 10;

  const initializeGame = useCallback(() => {
    const countriesWithCapitals = countries.filter(country => country.capital);
    const shuffledCountries = shuffleArray(countriesWithCapitals);
    const selectedQuestions = shuffledCountries.slice(0, totalQuestions);
    setQuestions(selectedQuestions);
    
    if (selectedQuestions.length > 0) {
      const options = generateOptions(selectedQuestions[0], countriesWithCapitals);
      setCurrentOptions(options);
    }
    
    setCurrentQuestion(0);
    setScore(0);
    setTimeElapsed(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setGameComplete(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameComplete && !isAnswerRevealed) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameComplete, isAnswerRevealed]);

  const handleAnswerSelect = (countryCode: string) => {
    if (isAnswerRevealed) return;
    
    setSelectedAnswer(countryCode);
    setIsAnswerRevealed(true);
    
    if (countryCode === questions[currentQuestion].code) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setGameComplete(true);
      } else {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        const countriesWithCapitals = countries.filter(country => country.capital);
        const options = generateOptions(questions[nextQuestion], countriesWithCapitals);
        setCurrentOptions(options);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
      }
    }, 1500);
  };

  if (gameComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <GameCompletion
          timeElapsed={timeElapsed}
          onPlayAgain={initializeGame}
          onBackToMenu={onBackToMenu}
        />
        <Card className="p-6 text-center bg-white/80 backdrop-blur-sm mt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Final Score</h3>
          <p className="text-2xl font-bold text-blue-600">{score} / {totalQuestions}</p>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentCountry = questions[currentQuestion];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <GameHeader
        timeElapsed={timeElapsed}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onBackToMenu={onBackToMenu}
      />

      <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Which country has this capital city?
          </h2>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {currentCountry.capital}
          </div>
          <div className="text-lg text-gray-600">
            Score: {score} / {totalQuestions}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentOptions.map((option) => {
            let buttonClass = "w-full p-4 text-left border-2 transition-all duration-200";
            
            if (!isAnswerRevealed) {
              buttonClass += " border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50";
            } else {
              if (option.code === currentCountry.code) {
                buttonClass += " border-green-500 bg-green-100 text-green-800";
              } else if (option.code === selectedAnswer) {
                buttonClass += " border-red-500 bg-red-100 text-red-800";
              } else {
                buttonClass += " border-gray-300 bg-gray-100 text-gray-600";
              }
            }

            return (
              <Button
                key={option.code}
                variant="ghost"
                className={buttonClass}
                onClick={() => handleAnswerSelect(option.code)}
                disabled={isAnswerRevealed}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.flag}</span>
                  <span className="text-lg font-medium">{option.name}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CapitalGame;
