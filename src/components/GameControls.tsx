import React from 'react';
import {  Square, Undo, Redo, Lightbulb } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  showHints: boolean;
  onToggleHints: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isAutoPlay: boolean;
}

export default function GameControls({
  onNewGame,
  onUndo,
  onRedo,
  showHints,
  onToggleHints,
  canUndo,
  canRedo,
}: GameControlsProps) {
  const handleNewGame = (e: React.MouseEvent) => {
    e.preventDefault();
    onNewGame();
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    onUndo();
  };

  const handleRedo = (e: React.MouseEvent) => {
    e.preventDefault();
    onRedo();
  };

  const handleToggleHints = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleHints();
  };

  return (
    <div className="flex flex-wrap justify-center gap-1 p-1 bg-white rounded-lg shadow mt-1">
      <button
        onClick={handleNewGame}
        type="button"
        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm"
      >
        <Square className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">New Game</span>
      </button>
      
      <button
        onClick={handleUndo}
        type="button"
        disabled={!canUndo}
        className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
      >
        <Undo className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Undo</span>
      </button>
      
      <button
        onClick={handleRedo}
        type="button"
        disabled={!canRedo}
        className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
      >
        <Redo className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Redo</span>
      </button>
      
      <button
        onClick={handleToggleHints}
        type="button"
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs sm:text-sm ${
          showHints
            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
            : 'bg-gray-400 text-white hover:bg-gray-500'
        }`}
      >
        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Hints</span>
      </button>
    </div>
  );
}