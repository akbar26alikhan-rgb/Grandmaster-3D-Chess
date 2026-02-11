
import React from 'react';

interface HomeProps {
  onStart: () => void;
  onSettings: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart, onSettings }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-white drop-shadow-2xl">
            CHESS<span className="text-amber-500">3D</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-300 tracking-[0.2em] uppercase">
            Grandmaster Edition
          </p>
        </div>

        <div className="flex flex-col space-y-4 max-w-sm mx-auto">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-500 transition-all rounded-full overflow-hidden shadow-xl"
          >
            <span className="relative z-10 text-xl font-bold uppercase tracking-wider">Play vs AI</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 transition-all rounded-full backdrop-blur-md text-xl font-bold uppercase tracking-wider"
          >
            Local Multi
          </button>

          <button 
            onClick={onSettings}
            className="px-8 py-2 text-slate-400 hover:text-white transition-colors uppercase tracking-widest text-sm"
          >
            Settings
          </button>
        </div>

        <div className="pt-12 flex justify-center space-x-12 text-slate-500">
           <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">3D</p>
              <p className="text-xs uppercase">Engine</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">Minimax</p>
              <p className="text-xs uppercase">AI</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-bold text-slate-300">2K</p>
              <p className="text-xs uppercase">Textures</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
