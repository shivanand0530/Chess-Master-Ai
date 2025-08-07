// import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Minus } from 'lucide-react';
import { Chess } from 'chess.js';

interface GameStatusProps {
  game: Chess;
}

export default function GameStatus({ game }: GameStatusProps) {
  const getGameStatus = () => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      return {
        icon: <XCircle className="w-6 h-6 text-red-500" />,
        message: `Checkmate! ${winner} wins!`,
        color: 'text-red-700',
        bg: 'bg-red-50',
      };
    }
    
    if (game.isDraw()) {
      return {
        icon: <Minus className="w-6 h-6 text-gray-500" />,
        message: "It's a draw! (50-move rule)",
        color: 'text-gray-700',
        bg: 'bg-gray-50',
      };
    }
    
    if (game.isStalemate()) {
      return {
        icon: <Minus className="w-6 h-6 text-gray-500" />,
        message: "It's a draw! (Stalemate)",
        color: 'text-gray-700',
        bg: 'bg-gray-50',
      };
    }
    
    if (game.isThreefoldRepetition()) {
      return {
        icon: <Minus className="w-6 h-6 text-gray-500" />,
        message: "It's a draw! (Threefold repetition)",
        color: 'text-gray-700',
        bg: 'bg-gray-50',
      };
    }
    
    if (game.isInsufficientMaterial()) {
      return {
        icon: <Minus className="w-6 h-6 text-gray-500" />,
        message: "It's a draw! (Insufficient material)",
        color: 'text-gray-700',
        bg: 'bg-gray-50',
      };
    }
    
    if (game.inCheck()) {
      const player = game.turn() === 'w' ? 'White' : 'Black';
      return {
        icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
        message: `${player} is in check!`,
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
      };
    }
    
    return {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      message: `Game in progress`,
      color: 'text-green-700',
      bg: 'bg-green-50',
    };
  };

  const status = getGameStatus();

  return (
    <div className="flex items-center">
      <div className={`rounded px-2 py-1 ${status.bg} flex items-center`}>
        <span className="scale-75">{status.icon}</span>
        <p className={`ml-1 ${status.color} text-xs font-medium`}>{status.message}</p>
      </div>
    </div>
  );
}