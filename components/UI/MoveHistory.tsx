
import React, { useRef, useEffect } from 'react';
import { HistoryItem } from '../../types';

interface MoveHistoryProps {
  history: HistoryItem[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      w: history[i],
      b: history[i + 1]
    });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {pairs.map((p) => (
          <div key={p.num} className="flex items-center text-sm py-1.5 border-b border-white/5 hover:bg-white/5 transition-colors px-2 rounded group">
            <span className="w-8 text-slate-500 font-mono text-xs">{p.num}.</span>
            <span className="flex-1 font-semibold text-slate-200">{p.w.san}</span>
            <span className="flex-1 font-semibold text-slate-200">{p.b ? p.b.san : ''}</span>
          </div>
        ))}
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs uppercase tracking-widest">No moves yet</p>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-slate-500 text-center">
        Notation: Standard Algebraic
      </div>
    </div>
  );
};

export default MoveHistory;
