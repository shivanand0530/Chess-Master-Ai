// import React from 'react';
import { Brain, Clock, Zap } from 'lucide-react';

interface GameStatsProps {
  positionsEvaluated: number;
  timeElapsed: number;
  positionsPerSecond: number;
  advantage: number;
}

export default function GameStats({
  positionsEvaluated,
  timeElapsed,
  positionsPerSecond,
  advantage,
}: GameStatsProps) {
  const getAdvantageText = () => {
    if (advantage > 0) return { color: 'Black', value: advantage };
    if (advantage < 0) return { color: 'White', value: Math.abs(advantage) };
    return { color: 'Neither side', value: 0 };
  };

  const advantageInfo = getAdvantageText();
  const advantagePercentage = Math.min(Math.max(((advantage + 2000) / 4000) * 100, 0), 100);

  const formatNumber = (num: number) => {
    return num > 999 ? `${(num/1000).toFixed(1)}K` : num;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Game Statistics</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-gray-600">Positions</span>
          </div>
          <span className="font-mono font-bold text-blue-600">
            {positionsEvaluated}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-gray-600">Time</span>
          </div>
          <span className="font-mono font-bold text-green-600">{timeElapsed.toFixed(2)}s</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-gray-600">Speed</span>
          </div>
          <span className="font-mono font-bold text-purple-600">
            {formatNumber(positionsPerSecond)}/s
          </span>
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Position Advantage</h3>
          <p className="text-sm text-gray-600 mb-2">
            {advantageInfo.color} has the advantage
          </p>
          
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                width: `${advantagePercentage}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>White Advantage</span>
            <span>Black Advantage</span>
          </div>
        </div>
      </div>
    </div>
  );
}