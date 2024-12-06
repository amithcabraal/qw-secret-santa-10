import React from 'react';
import { Button } from '../ui/Button';
import { useImageNavigation } from '../../hooks/useImageNavigation';
import { useGameStore } from '../../store/gameStore';

export const NavigationControls: React.FC = () => {
  const { showAnswer, toggleAnswer, gameMode } = useGameStore();
  const { nextImage, previousImage, isNavigating } = useImageNavigation();

  // Add darker background for better visibility
  const buttonClasses = `
    bg-gray-900/90 hover:bg-gray-800 
    backdrop-blur-sm shadow-lg 
    transition-transform hover:scale-110 
    disabled:opacity-50 disabled:cursor-not-allowed
    border border-gray-700
  `;

  return (
    <div className="absolute left-0 right-0 bottom-8 flex justify-center gap-4">
      <Button 
        variant="icon" 
        onClick={previousImage}
        disabled={isNavigating}
        className={buttonClasses}
      >
        <span className="block w-3 h-3 border-l-2 border-b-2 border-white transform -rotate-45"></span>
      </Button>
      
      <Button 
        onClick={toggleAnswer}
        disabled={isNavigating}
        className={`${buttonClasses} px-6 hover:scale-105`}
      >
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </Button>
      
      <Button 
        variant="icon" 
        onClick={nextImage}
        disabled={isNavigating}
        className={buttonClasses}
      >
        <span className="block w-3 h-3 border-r-2 border-t-2 border-white transform -rotate-45"></span>
      </Button>
    </div>
  );
};