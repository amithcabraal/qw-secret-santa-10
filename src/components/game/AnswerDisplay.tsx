import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const AnswerDisplay: React.FC = () => {
  const { showAnswer, currentImage } = useGameStore();

  if (!showAnswer) return null;

  return (
    <div className="absolute left-0 right-0 top-4 text-center">
      <div className="inline-block bg-gray-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg animate-slide-up">
        <p className="text-2xl font-bold">{currentImage.personName}</p>
      </div>
    </div>
  );
};