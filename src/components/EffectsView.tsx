import React, { useEffect } from 'react';
import { ImageDisplay } from './game/ImageDisplay';
import { NavigationControls } from './game/NavigationControls';
import { AnswerDisplay } from './game/AnswerDisplay';
import { useGameStore } from '../store/gameStore';
import { useGameSeed } from '../hooks/useGameSeed';

export const EffectsView: React.FC = () => {
  const { currentImageIndex, setGameMode } = useGameStore();
  useGameSeed();

  useEffect(() => {
    setGameMode('effects');
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      <div 
        key={currentImageIndex} 
        className="relative max-w-2xl mx-auto animate-fade-in"
      >
        <ImageDisplay />
        <NavigationControls />
        <AnswerDisplay />
      </div>
    </div>
  );
};