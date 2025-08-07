// import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Square, Undo, Redo, Lightbulb } from 'lucide-react';
import ChessBoard from './components/ChessBoard';
// import GameControls from './components/GameControls';
import GameStatus from './components/GameStatus';
import GameStats from './components/GameStats';
import GameSettings from './components/GameSettings';
import './App.css';
import './chess-responsive.css';

function App() {
  const [game, setGame] = useState(new Chess());
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [aiDepth, setAiDepth] = useState(3);
  const [showHints, setShowHints] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [gameStats, setGameStats] = useState({
    positionsEvaluated: 0,
    timeElapsed: 0,
    positionsPerSecond: 0,
  });
  const [advantage, setAdvantage] = useState(0);
  
  // Determine if undo/redo are available
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < gameHistory.length - 2;

  const handleGameChange = useCallback((newGame: Chess) => {
    setGame(newGame);
    // Add to history for undo/redo functionality
    const newHistory = gameHistory.slice(0, historyIndex + 1);
    newHistory.push(newGame.fen());
    setGameHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [gameHistory, historyIndex]);

  const handleNewGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGameHistory([newGame.fen()]);
    setHistoryIndex(0);
    setAdvantage(0);
    setIsAutoPlay(false);
    setGameStats({ positionsEvaluated: 0, timeElapsed: 0, positionsPerSecond: 0 });
  }, []);


  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = Math.max(0, historyIndex - 2); // Undo both player and AI moves
      const newGame = new Chess(gameHistory[newIndex]);
      setGame(newGame);
      setHistoryIndex(newIndex);
      setIsAutoPlay(false);
    }
  }, [gameHistory, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < gameHistory.length - 2) {
      const newIndex = Math.min(gameHistory.length - 1, historyIndex + 2); // Redo both moves
      const newGame = new Chess(gameHistory[newIndex]);
      setGame(newGame);
      setHistoryIndex(newIndex);
    }
  }, [gameHistory, historyIndex]);

  const handleToggleHints = useCallback(() => {
    setShowHints(!showHints);
  }, [showHints]);

  const handleStatsUpdate = useCallback((stats: typeof gameStats) => {
    setGameStats(stats);
  }, []);

  const handleAdvantageUpdate = useCallback((newAdvantage: number) => {
    setAdvantage(newAdvantage);
  }, []);
  
  const memoizedGameSettings = useMemo(() => (
    <GameSettings
      aiDepth={aiDepth}
      onDepthChange={setAiDepth}
      showHints={showHints}
      onToggleHints={handleToggleHints}
      playerColor={playerColor}
      onPlayerColorChange={setPlayerColor}
    />
  ), [aiDepth, showHints, playerColor, handleToggleHints]);
  // Use memoization to prevent unnecessary re-renders
  const memoizedChessBoard = useMemo(() => (
    <ChessBoard
      game={game}
      onGameChange={handleGameChange}
      aiDepth={aiDepth}
      showHints={showHints}
      onStatsUpdate={handleStatsUpdate}
      onAdvantageUpdate={handleAdvantageUpdate}
      isAutoPlay={isAutoPlay}
      gamePosition={game.fen()}
      playerColor={playerColor}
    />
  ), [game, handleGameChange, aiDepth, showHints, handleStatsUpdate, handleAdvantageUpdate, isAutoPlay, playerColor]);

  // Game status component with winner display
  const memoizedGameStatus = useMemo(() => (
    <GameStatus game={game} />
  ), [game]);

  // Check if game is over to show winner prominently
  const isGameOver = game.isGameOver();
  const winner = game.isCheckmate() ? (game.turn() === 'w' ? 'Black' : 'White') : null;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Centered Header */}
      <header className="bg-white shadow-sm border-b py-1">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900">Chess AI Master</h1>
        </div>
      </header>

      {/* Game status bar */}
      <div className="bg-white py-1 px-4 flex justify-center items-center">
        {memoizedGameStatus}
      </div>

      {/* Winner announcement overlay */}
      {isGameOver && winner && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Checkmate!</h2>
            <p className="text-xl font-semibold">{winner} wins the game!</p>
            <button 
              onClick={handleNewGame}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full flex flex-row overflow-hidden mobile-layout">
        {/* Left sidebar with controls */}
        <div className="w-12 bg-white shadow-md flex flex-col items-center py-2 space-y-4 md:space-y-4 md:space-x-0 space-x-4 space-y-0 mobile-controls">
          <button
            onClick={handleNewGame}
            title="New Game"
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
          >
            <Square className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleToggleHints}
            title="Toggle Hints"
            className={`p-2 rounded-full ${showHints ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-blue-100 text-blue-600'}`}
          >
            <Lightbulb className="w-6 h-6" />
          </button>
        </div>

        {/* Main content area with chess board and info panels */}
        <div className="flex-1 flex flex-row items-stretch p-1 mobile-board-container">
          {/* Left panel with game stats */}
          <div className="w-1/4 flex flex-col p-2 space-y-4 overflow-auto">
            <GameStats
              positionsEvaluated={gameStats.positionsEvaluated}
              timeElapsed={gameStats.timeElapsed}
              positionsPerSecond={gameStats.positionsPerSecond}
              advantage={advantage}
            />
          </div>
          
          {/* Center area with chess board */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="w-3/4 h-3/4 flex items-center justify-center p-1 py-4">
              {memoizedChessBoard}
            </div>
          </div>
          
          {/* Right panel with game settings */}
          <div className="w-1/4 flex flex-col p-2 space-y-4 overflow-auto">
            {memoizedGameSettings}
          </div>
        </div>
      </main>

      {/* Footer with copyright */}
      <footer className="bg-white py-1 text-center text-xs text-gray-500 border-t">
        <p>© {new Date().getFullYear()} Chess AI Master. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
