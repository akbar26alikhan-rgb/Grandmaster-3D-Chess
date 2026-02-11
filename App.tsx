
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings } from './types';
import Home from './components/Home';
import Game from './components/Game';
import SettingsScreen from './components/SettingsScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'medium',
    timerMinutes: 10,
    theme: 'classic',
    showHints: true
  });

  const startGame = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const goToHome = useCallback(() => {
    setGameState(GameState.HOME);
  }, []);

  const openSettings = useCallback(() => {
    setGameState(GameState.SETTINGS);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {gameState === GameState.HOME && (
        <Home onStart={startGame} onSettings={openSettings} />
      )}
      {gameState === GameState.PLAYING && (
        <Game settings={settings} onExit={goToHome} />
      )}
      {gameState === GameState.SETTINGS && (
        <SettingsScreen 
          settings={settings} 
          onSave={(newSettings) => {
            setSettings(newSettings);
            setGameState(GameState.HOME);
          }} 
          onCancel={goToHome}
        />
      )}
    </div>
  );
};

export default App;
