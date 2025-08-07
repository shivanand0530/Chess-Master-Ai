export interface ChessMove {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  flags: string;
  san: string;
  lan: string;
  before: string;
  after: string;
  color: 'w' | 'b';
}

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  isInsufficientMaterial: boolean;
}

export interface AISettings {
  depth: number;
  showHints: boolean;
}

export interface GameStats {
  positionsEvaluated: number;
  timeElapsed: number;
  positionsPerSecond: number;
}