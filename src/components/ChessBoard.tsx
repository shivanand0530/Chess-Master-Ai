import { useState, useCallback, useEffect, memo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { getBestMove, evaluatePosition } from '../utils/chessAI';
import type { Square } from 'react-chessboard/dist/chessboard/types';

interface ChessBoardProps {
  game: Chess;
  onGameChange: (game: Chess) => void;
  aiDepth: number;
  showHints: boolean;
  onStatsUpdate: (stats: { positionsEvaluated: number; timeElapsed: number; positionsPerSecond: number }) => void;
  onAdvantageUpdate: (advantage: number) => void;
  isAutoPlay: boolean;
  gamePosition: string;
  playerColor: 'white' | 'black';
}

function ChessBoard({
  game,
  onGameChange,
  aiDepth,
  showHints,
  onStatsUpdate,
  onAdvantageUpdate,
  isAutoPlay,
  gamePosition,
  playerColor,
}: ChessBoardProps) {
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  // const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, any>>({});
  const [moveSquares, setMoveSquares] = useState<Record<string, any>>({});
  const [globalSum, setGlobalSum] = useState(0);

  useEffect(() => {
    if (gamePosition !== game.fen()) {
      const newGame = new Chess(gamePosition);
      onGameChange(newGame);
      setGlobalSum(0);
    }
    
    // Initialize the game if it's a new game
    if (game.history().length === 0 && playerColor === 'black') {
      // If player is black, make the first move as white
      setTimeout(() => makeAIMove(), 500);
    }
  }, [gamePosition, playerColor]);

  useEffect(() => {
    if (isAutoPlay && !game.isGameOver()) {
      // Use requestAnimationFrame for better performance
      const animationId = requestAnimationFrame(() => {
        makeAIMove();
      });
      return () => cancelAnimationFrame(animationId);
    }
  }, [game.fen(), isAutoPlay]);

  const makeAIMove = useCallback(() => {
    if (game.isGameOver()) return;

    // Use setTimeout with a small delay to prevent UI blocking and ensure rendering
    setTimeout(() => {
      try {
        const currentSum = game.turn() === 'b' ? globalSum : -globalSum;
        const result = getBestMove(game, game.turn(), currentSum, aiDepth);
        
        if (result.move) {
          const newGame = new Chess(game.fen());
          const move = newGame.move(result.move);
          
          if (move) {
            const newSum = evaluatePosition(newGame, move, globalSum);
            setGlobalSum(newSum);
            onAdvantageUpdate(newSum);
            onStatsUpdate(result.stats);
            onGameChange(newGame);
            
            // Highlight the AI move with different colors based on piece color
            const highlightColor = move.color === 'w' ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 255, 0, 0.4)';
            setMoveSquares({
              [move.from]: { backgroundColor: highlightColor },
              [move.to]: { backgroundColor: highlightColor },
            });
            
            // If player is black and AI just made a move as white at the start of the game
            // Don't make another move (this prevents double-moves when player is black)
            if (playerColor === 'black' && move.color === 'w' && newGame.history().length <= 1) {
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error making AI move:', error);
      }
    }, 100); // Slightly longer delay for better reliability
  }, [game, globalSum, aiDepth, onGameChange, onAdvantageUpdate, onStatsUpdate, playerColor]);

  const makeAMove = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      const newGame = new Chess(game.fen());
      
      try {
        const move = newGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Always promote to queen for simplicity
        });

        if (move) {
          // Use requestAnimationFrame for smoother UI updates
          requestAnimationFrame(() => {
            const newSum = evaluatePosition(newGame, move, globalSum);
            setGlobalSum(newSum);
            onAdvantageUpdate(newSum);
            onGameChange(newGame);
            
            // Highlight the player move with color based on piece color
            const playerHighlightColor = move.color === 'w' ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 255, 0, 0.4)';
            setMoveSquares({
              [sourceSquare]: { backgroundColor: playerHighlightColor },
              [targetSquare]: { backgroundColor: playerHighlightColor },
            });

            // Make AI move after player move if game is not over
            if (!newGame.isGameOver()) {
              // Use setTimeout with a small delay for better reliability
              setTimeout(() => {
                try {
                  const aiResult = getBestMove(newGame, newGame.turn(), newSum, aiDepth);
                  if (aiResult.move) {
                    const aiMove = newGame.move(aiResult.move);
                    if (aiMove) {
                      const finalSum = evaluatePosition(newGame, aiMove, newSum);
                      setGlobalSum(finalSum);
                      onAdvantageUpdate(finalSum);
                      onStatsUpdate(aiResult.stats);
                      onGameChange(newGame);
                      
                      // Highlight AI move with color based on piece color
                      const aiHighlightColor = aiMove.color === 'w' ? 'rgba(0, 0, 255, 0.4)' : 'rgba(255, 255, 0, 0.4)';
                      setMoveSquares({
                        [aiMove.from]: { backgroundColor: aiHighlightColor },
                        [aiMove.to]: { backgroundColor: aiHighlightColor },
                      });
                    }
                  }
                } catch (error) {
                  console.error('Error making AI response move:', error);
                }
              }, 300); // Slightly longer delay for better reliability
            }
          });
          return true;
        }
      } catch (error) {
        console.error('Error making player move:', error);
        return false;
      }
      return false;
    },
    [game, globalSum, aiDepth, onGameChange, onAdvantageUpdate, onStatsUpdate]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      setRightClickedSquares({});

      if (!moveFrom) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) {
          setMoveFrom(square);
        }
        return;
      }

      if (!moveTo) {
        const validMove = makeAMove(moveFrom, square);
        if (validMove) {
          setMoveFrom(null);
          setMoveTo(null);
          setOptionSquares({});
          return;
        }

        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : null);
        return;
      }
    },
    [moveFrom, moveTo, makeAMove]
  );

  const getMoveOptions = useCallback(
    (square: Square) => {
      const moves = game.moves({
        square,
        verbose: true,
      });
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      const newSquares: Record<string, any> = {};
      moves.map((move) => {
        newSquares[move.to] = {
          background:
            game.get(move.to as Square) &&
            game.get(move.to as Square)?.color !== game.get(square)?.color
              ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
              : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
          borderRadius: '50%',
        };
        return move;
      });
      newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)',
      };
      setOptionSquares(newSquares);
      return true;
    },
    [game]
  );

  const onSquareRightClick = useCallback((square: Square) => {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }, [rightClickedSquares]);

  // Show hint move
  const getHintSquares = useCallback(() => {
    if (!showHints || game.turn() !== 'w' || game.isGameOver()) return {};
    
    const result = getBestMove(game, 'w', -globalSum, Math.min(aiDepth, 2));
    if (result.move) {
      return {
        [result.move.from]: { backgroundColor: 'rgba(255, 0, 0, 0.4)' },
        [result.move.to]: { backgroundColor: 'rgba(255, 0, 0, 0.4)' },
      };
    }
    return {};
  }, [showHints, game, globalSum, aiDepth]);

  const customSquareStyles = {
    ...moveSquares,
    ...optionSquares,
    ...rightClickedSquares,
    ...(showHints ? getHintSquares() : {}),
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Chessboard
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customSquareStyles={customSquareStyles}
        boardOrientation={playerColor}
        arePiecesDraggable={false}
        id="responsive-chess-board"
      />
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(ChessBoard);