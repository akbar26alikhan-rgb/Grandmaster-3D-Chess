
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { GameSettings, HistoryItem } from '../types';
import Board3D from './Board3D';
import MoveHistory from './UI/MoveHistory';
import ChessTimer from './UI/ChessTimer';
import { ChessAI } from '../chessAI';

interface GameProps {
  settings: GameSettings;
  onExit: () => void;
}

const ai = new ChessAI();

const Game: React.FC<GameProps> = ({ settings, onExit }) => {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [timers, setTimers] = useState({ w: settings.timerMinutes * 60, b: settings.timerMinutes * 60 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Fix: Use any for the timer reference to avoid 'NodeJS' namespace error in browser environments
  const timerRef = useRef<any>(null);

  const checkGameOver = useCallback((g: Chess) => {
    if (g.isGameOver()) {
      setIsGameOver(true);
      if (g.isCheckmate()) setGameOverReason(`Checkmate! ${g.turn() === 'w' ? 'Black' : 'White'} wins.`);
      else if (g.isDraw()) setGameOverReason('Draw!');
      else if (g.isStalemate()) setGameOverReason('Stalemate!');
      else setGameOverReason('Game Over');
      return true;
    }
    return false;
  }, []);

  const makeMove = useCallback((move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        setHistory(prev => [...prev, {
          san: result.san,
          from: result.from,
          to: result.to,
          color: result.color
        }]);
        checkGameOver(game);
        setSelectedSquare(null);
        setValidMoves([]);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game, checkGameOver]);

  const onSquareClick = useCallback((square: string) => {
    if (isGameOver || isAiThinking) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const moves = game.moves({ square: square as ChessSquare, verbose: true });
    if (moves.length > 0) {
      setSelectedSquare(square);
      setValidMoves(moves.map(m => m.to));
    } else if (selectedSquare) {
      const moveResult = makeMove({ from: selectedSquare, to: square, promotion: 'q' });
      if (!moveResult) {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  }, [game, isGameOver, isAiThinking, selectedSquare, makeMove]);

  // AI Turn
  useEffect(() => {
    if (!isGameOver && game.turn() === 'b' && !isAiThinking) {
      setIsAiThinking(true);
      setTimeout(() => {
        const bestMove = ai.getBestMove(game, settings.difficulty);
        if (bestMove) {
          makeMove(bestMove);
        }
        setIsAiThinking(false);
      }, 500);
    }
  }, [game, isGameOver, isAiThinking, makeMove, settings.difficulty]);

  // Timers
  useEffect(() => {
    if (isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Fix: Explicitly use window.setInterval for standard browser behavior
    timerRef.current = window.setInterval(() => {
      setTimers(prev => {
        const currentTurn = game.turn();
        const next = { ...prev };
        next[currentTurn] = Math.max(0, next[currentTurn] - 1);
        if (next[currentTurn] === 0) {
           setIsGameOver(true);
           setGameOverReason(`Time out! ${currentTurn === 'w' ? 'Black' : 'White'} wins.`);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game, isGameOver]);

  const undoMove = () => {
    game.undo(); // Undo AI
    game.undo(); // Undo Player
    setGame(new Chess(game.fen()));
    setHistory(prev => prev.slice(0, -2));
    setIsGameOver(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full relative">
      {/* 3D Board Area */}
      <div className="flex-1 relative bg-slate-900 cursor-grab active:cursor-grabbing">
        <Board3D 
          fen={game.fen()} 
          onSquareClick={onSquareClick} 
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          theme={settings.theme}
        />
        
        {/* Overlay UI */}
        <div className="absolute top-6 left-6 flex flex-col space-y-4">
           <ChessTimer color="b" time={timers.b} active={game.turn() === 'b'} label="Computer" />
           <ChessTimer color="w" time={timers.w} active={game.turn() === 'w'} label="You" />
        </div>

        <div className="absolute bottom-6 left-6 flex space-x-4">
          <button 
            onClick={onExit}
            className="px-6 py-2 glass-panel rounded-lg hover:bg-slate-700 transition-colors uppercase text-xs font-bold"
          >
            Resign
          </button>
          <button 
            onClick={undoMove}
            disabled={history.length < 2}
            className="px-6 py-2 glass-panel rounded-lg hover:bg-slate-700 transition-colors uppercase text-xs font-bold disabled:opacity-50"
          >
            Undo
          </button>
        </div>

        {isAiThinking && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="glass-panel px-6 py-3 rounded-full flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">AI Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-full md:w-80 h-1/3 md:h-full bg-slate-950/90 border-t md:border-t-0 md:border-l border-white/5 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          <span>Match Analytics</span>
        </h2>
        <MoveHistory history={history} />
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel p-12 rounded-3xl text-center max-w-md w-full border-amber-500/30">
            <h3 className="text-4xl font-bold mb-2">Game Over</h3>
            <p className="text-xl text-slate-400 mb-8">{gameOverReason}</p>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => { setGame(new Chess()); setHistory([]); setTimers({ w: settings.timerMinutes * 60, b: settings.timerMinutes * 60 }); setIsGameOver(false); }}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/20"
              >
                New Game
              </button>
              <button 
                onClick={onExit}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
