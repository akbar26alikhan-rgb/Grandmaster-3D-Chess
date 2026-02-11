
import React from 'react';

interface ChessTimerProps {
  time: number;
  active: boolean;
  color: 'w' | 'b';
  label: string;
}

const ChessTimer: React.FC<ChessTimerProps> = ({ time, active, color, label }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-4 rounded-2xl glass-panel min-w-[160px] transition-all duration-500 border-2 ${
      active ? 'border-amber-500 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-transparent opacity-70'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</span>
        <div className={`w-2 h-2 rounded-full ${color === 'w' ? 'bg-white' : 'bg-slate-700'} border border-slate-500`}></div>
      </div>
      <div className={`text-3xl font-mono font-bold ${active ? 'text-white' : 'text-slate-400'}`}>
        {formatTime(time)}
      </div>
      {active && (
        <div className="h-1 bg-amber-500/20 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 animate-pulse w-full"></div>
        </div>
      )}
    </div>
  );
};

export default ChessTimer;
