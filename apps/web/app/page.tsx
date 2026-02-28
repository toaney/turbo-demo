'use client';

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import GamePage from './components/GamePage';
import { GameConfig } from './types';

export default function Home() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  if (gameConfig) {
    return <GamePage config={gameConfig} onBack={() => setGameConfig(null)} />;
  }

  return <LandingPage onStart={setGameConfig} />;
}
