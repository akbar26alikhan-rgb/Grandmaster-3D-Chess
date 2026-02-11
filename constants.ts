
export const SQUARE_SIZE = 1;
export const BOARD_SIZE = 8;

export const THEMES = {
  classic: {
    light: '#a1a2a3', // Slightly darker silver for better contrast with white chrome pieces
    dark: '#2d241c',  // Warmer dark wood/ebony to contrast with black metal pieces
    board: '#0c0a08', // Polished Dark Frame
    pieceWhite: '#ffffff', // High-Polished Chrome
    pieceBlack: '#121212', // Deep Anodized Black
    accent: '#d4af37'      // Brighter Gold/Brass Detail
  },
  marble: {
    light: '#f0f0f0',
    dark: '#9ca3af',
    board: '#1f2937',
    pieceWhite: '#e5e7eb',
    pieceBlack: '#111827',
    accent: '#f59e0b'
  },
  dark: {
    light: '#4b5563',
    dark: '#1f2937',
    board: '#000000',
    pieceWhite: '#d1d5db',
    pieceBlack: '#0a0a0a',
    accent: '#f59e0b'
  }
};

// Material weights
export const PIECE_VALUES: Record<string, number> = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

// Simple position tables for AI evaluation
export const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

export const KNIGHT_TABLE = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20,   0,   5,   5,   0, -20, -40],
    [-30,   5,  10,  15,  15,  10,   5, -30],
    [-30,   0,  15,  20,  20,  15,   0, -30],
    [-30,   5,  10,  15,  15,  10,   5, -30],
    [-30,   0,   5,  10,  10,   5,   0, -30],
    [-40, -20,   0,   0,   0,   0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];
