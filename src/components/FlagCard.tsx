
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
        relative aspect-square cursor-pointer transition-all duration-300 
        ${isFlipped ? 'bg-green-500 border-green-600' : 'bg-white hover:bg-gray-50'} 
        border-2 shadow-md hover:shadow-lg p-2
      `}
      onClick={onClick}
      style={{
        animation: isShaking ? 'shake 0.6s ease-in-out' : undefined,
      }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-6xl">{country.flag}</div>
      </div>
    </Card>
  );
};

export default FlagCard;
