
import React, { useState } from 'react';
import { GameSettings } from '../types';

interface SettingsScreenProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onCancel: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSave, onCancel }) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-900">
      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-2xl border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">System Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">AI Difficulty</label>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setLocalSettings({ ...localSettings, difficulty: d as any })}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold capitalize transition-all ${
                    localSettings.difficulty === d ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Timer (Minutes)</label>
            <input 
              type="range" min="1" max="60" 
              value={localSettings.timerMinutes} 
              onChange={(e) => setLocalSettings({ ...localSettings, timerMinutes: parseInt(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
            />
            <div className="text-right text-lg font-bold text-amber-500">{localSettings.timerMinutes} mins</div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Board Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {['classic', 'marble', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalSettings({ ...localSettings, theme: t as any })}
                  className={`py-3 rounded-xl border-2 transition-all capitalize text-xs font-bold ${
                    localSettings.theme === t ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-800 bg-slate-800/50 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Visuals */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Gameplay Hints</label>
            <button
               onClick={() => setLocalSettings({ ...localSettings, showHints: !localSettings.showHints })}
               className={`w-full py-3 rounded-xl border-2 transition-all font-bold ${
                 localSettings.showHints ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
               }`}
            >
              {localSettings.showHints ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => onSave(localSettings)}
            className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20"
          >
            Apply Changes
          </button>
          <button 
            onClick={onCancel}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
