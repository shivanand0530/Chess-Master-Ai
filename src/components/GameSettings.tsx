import React from 'react';
import { Settings, Cpu, User } from 'lucide-react';

interface GameSettingsProps {
  aiDepth: number;
  onDepthChange: (depth: number) => void;
  showHints: boolean;
  onToggleHints: () => void;
  playerColor: 'white' | 'black';
  onPlayerColorChange: (color: 'white' | 'black') => void;
}

export default function GameSettings({
  aiDepth,
  onDepthChange,
  showHints,
  onToggleHints,
  playerColor,
  onPlayerColorChange,
}: GameSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-800">Game Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center text-md font-medium text-gray-700 mb-2">
            <User className="w-5 h-5 mr-2" />
            Play as
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => onPlayerColorChange('white')}
              className={`flex-1 py-2 rounded-md ${playerColor === 'white' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              White
            </button>
            <button
              onClick={() => onPlayerColorChange('black')}
              className={`flex-1 py-2 rounded-md ${playerColor === 'black' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Black
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center text-md font-medium text-gray-700 mb-2">
            <Cpu className="w-5 h-5 mr-2" />
            AI Level (Search Depth)
          </label>
          <select
            value={aiDepth}
            onChange={(e) => onDepthChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>Beginner (Depth 1)</option>
            <option value={2}>Easy (Depth 2)</option>
            <option value={3}>Medium (Depth 3)</option>
            <option value={4}>Hard (Depth 4)</option>
            <option value={5}>Expert (Depth 5)</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Higher depth = stronger but slower moves
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-md font-medium text-gray-700">
              Show Move Hints
            </label>
            <button
              onClick={onToggleHints}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showHints ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showHints ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="bg-blue-50 rounded-md p-3 text-sm">
            <p className="text-blue-700">
              Hint colors: <span className="text-red-500 font-bold">Red</span> squares show the AI's suggested move for white pieces. <span className="text-yellow-500 font-bold">Yellow</span> squares show the last move played.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}