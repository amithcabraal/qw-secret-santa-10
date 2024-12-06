import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Button } from './ui/Button';
import { GameMode } from '../types/game';

export const Menu: React.FC = () => {
  const { isMenuOpen, toggleMenu, gameMode } = useGameStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    toggleMenu();
  };

  const handleModeChange = (mode: GameMode) => {
    const path = mode === 'effects' ? '/effects' : '/';
    navigate(path);
    toggleMenu();
  };

  const isAdmin = location.pathname === '/admin';

  return (
    <div className="fixed top-0 right-0 z-50">
      <Button 
        variant="icon" 
        onClick={toggleMenu} 
        className="m-4 bg-gray-800/50 hover:bg-gray-800/70"
      >
        <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
        <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </Button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl p-4 text-white">
          <div className="space-y-2">
            {isAdmin && (
              <Button
                variant="secondary"
                onClick={() => handleNavigation('/')}
                className="w-full justify-start gap-2"
              >
                Play Mode
              </Button>
            )}

            <div className="py-2 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Game Mode</p>
              <div className="space-y-2">
                <Button
                  variant={gameMode === 'mask' ? 'primary' : 'secondary'}
                  onClick={() => handleModeChange('mask')}
                  className="w-full justify-start"
                >
                  Santa Mask Mode
                </Button>
                <Button
                  variant={gameMode === 'effects' ? 'primary' : 'secondary'}
                  onClick={() => handleModeChange('effects')}
                  className="w-full justify-start"
                >
                  Effects Mode
                </Button>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => handleNavigation('/how-to-play')}
              className="w-full justify-start"
            >
              How to Play
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleNavigation('/share')}
              className="w-full justify-start"
            >
              Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};