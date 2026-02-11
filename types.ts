
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Color = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  rank: number;
  file: number;
}

export interface Move {
  from: string;
  to: string;
  promotion?: PieceType;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  timerMinutes: number;
  theme: 'classic' | 'marble' | 'dark';
  showHints: boolean;
}

export enum GameState {
  HOME = 'HOME',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  SETTINGS = 'SETTINGS'
}

export interface HistoryItem {
  san: string;
  from: string;
  to: string;
  color: Color;
}
