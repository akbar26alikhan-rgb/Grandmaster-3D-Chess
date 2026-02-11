
import { Chess, Move } from 'chess.js';
import { PIECE_VALUES, PAWN_TABLE, KNIGHT_TABLE } from './constants';

export class ChessAI {
  private evaluateBoard(game: Chess): number {
    let totalEvaluation = 0;
    const board = game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        totalEvaluation += this.getPieceValue(board[i][j], i, j);
      }
    }
    return totalEvaluation;
  }

  private getPieceValue(piece: any, x: number, y: number): number {
    if (piece === null) return 0;

    const getAbsoluteValue = (p: any, isWhite: boolean, x: number, y: number): number => {
      if (p.type === 'p') {
        return PIECE_VALUES.p + (isWhite ? PAWN_TABLE[x][y] : PAWN_TABLE[7 - x][y]);
      } else if (p.type === 'n') {
        return PIECE_VALUES.n + KNIGHT_TABLE[x][y];
      } else if (p.type === 'b') {
        return PIECE_VALUES.b;
      } else if (p.type === 'r') {
        return PIECE_VALUES.r;
      } else if (p.type === 'q') {
        return PIECE_VALUES.q;
      } else if (p.type === 'k') {
        return PIECE_VALUES.k;
      }
      return 0;
    };

    const absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
  }

  public minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
  ): number {
    if (depth === 0) {
      return -this.evaluateBoard(game);
    }

    const possibleMoves = game.moves();

    if (isMaximizingPlayer) {
      let bestEval = -9999;
      for (const move of possibleMoves) {
        game.move(move);
        bestEval = Math.max(bestEval, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
        game.undo();
        alpha = Math.max(alpha, bestEval);
        if (beta <= alpha) return bestEval;
      }
      return bestEval;
    } else {
      let bestEval = 9999;
      for (const move of possibleMoves) {
        game.move(move);
        bestEval = Math.min(bestEval, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
        game.undo();
        beta = Math.min(beta, bestEval);
        if (beta <= alpha) return bestEval;
      }
      return bestEval;
    }
  }

  public getBestMove(game: Chess, difficulty: string): string | null {
    const depth = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null;

    let bestMove = null;
    let bestValue = -9999;

    // Shuffle moves for variety in easy/medium
    const shuffledMoves = possibleMoves.sort(() => Math.random() - 0.5);

    for (const move of shuffledMoves) {
      game.move(move);
      const boardValue = this.minimax(game, depth - 1, -10000, 10000, false);
      game.undo();

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }

    return bestMove;
  }
}
