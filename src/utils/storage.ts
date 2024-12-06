import { GameImage } from '../types/game';

const STORAGE_KEY = 'santa-game-images';

export const saveImagesToStorage = (images: GameImage[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const loadImagesFromStorage = (): GameImage[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const exportToJson = (images: GameImage[]): void => {
  const dataStr = JSON.stringify(images, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', 'santa-game-images.json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromJson = async (file: File): Promise<GameImage[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const images = JSON.parse(e.target?.result as string);
        resolve(images);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};