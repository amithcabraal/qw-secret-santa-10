import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { generateRandomSeed } from '../utils/seededShuffle';

export const useGameSeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { initializeGameOrder } = useGameStore();

  useEffect(() => {
    let seed = parseInt(searchParams.get('seed') || '');
    
    if (isNaN(seed)) {
      seed = generateRandomSeed();
      setSearchParams({ seed: seed.toString() });
    }

    initializeGameOrder(seed);
  }, [searchParams, setSearchParams, initializeGameOrder]);
};