
import React from 'react';
import { Card } from '@/components/ui/card';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeElapsed: number;
}

const Timer: React.FC<TimerProps> = ({ timeElapsed }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm">
      <TimerIcon className="w-5 h-5 text-blue-600" />
      <span className="text-xl font-mono font-bold text-gray-800">
        {formatTime(timeElapsed)}
      </span>
    </Card>
  );
};

export default Timer;
