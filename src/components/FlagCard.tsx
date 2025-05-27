
import React from 'react';
import { Card } from '@/components/ui/card';

interface Country {
  name: string;
  flag: string;
  code: string;
}

interface FlagCardProps {
  country: Country;
  isFlipped: boolean;
  isShaking: boolean;
  onClick: () => void;
}

const FlagCard: React.FC<FlagCardProps> = ({ country, isFlipped, isShaking, onClick }) => {
  return (
    <Card 
      className={`
        relative h-20 cursor-pointer transition-all duration-300 
        ${isFlipped ? 'bg-green-100 border-green-300' : 'bg-white hover:bg-gray-50'} 
        ${isShaking ? 'animate-pulse' : ''} 
        border-2 shadow-md hover:shadow-lg
      `}
      onClick={onClick}
      style={{
        animation: isShaking ? 'shake 0.6s ease-in-out' : undefined,
      }}
    >
      <div className="flex items-center justify-center h-full p-2">
        {isFlipped ? (
          <div className="text-center">
            <div className="text-2xl mb-1">{country.flag}</div>
            <div className="text-xs font-medium text-green-700">✓</div>
          </div>
        ) : (
          <div className="text-4xl">{country.flag}</div>
        )}
      </div>
    </Card>
  );
};

export default FlagCard;
