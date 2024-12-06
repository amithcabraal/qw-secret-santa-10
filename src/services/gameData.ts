import { GameImage } from '../types/game';

const STORAGE_KEY = 'santa-game-images';
const EXPORTS_KEY = 'santa-game-exports';

interface ExportMetadata {
  id: string;
  name: string;
  date: string;
  imageCount: number;
}

export const saveImagesToStorage = (images: GameImage[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const loadImagesFromStorage = (): GameImage[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveExport = (images: GameImage[], name: string): ExportMetadata => {
  const exports = getExports();
  const exportData = {
    id: Date.now().toString(),
    name,
    date: new Date().toISOString(),
    imageCount: images.length,
  };
  
  // Save export metadata
  exports.push(exportData);
  localStorage.setItem(EXPORTS_KEY, JSON.stringify(exports));
  
  // Save actual export data
  localStorage.setItem(`export-${exportData.id}`, JSON.stringify({ images }));
  
  return exportData;
};

export const loadExport = (id: string): GameImage[] | null => {
  const exportData = localStorage.getItem(`export-${id}`);
  const parsed = exportData ? JSON.parse(exportData) : null;
  return parsed?.images || null;
};

export const getExports = (): ExportMetadata[] => {
  const exports = localStorage.getItem(EXPORTS_KEY);
  return exports ? JSON.parse(exports) : [];
};

export const deleteExport = (id: string): void => {
  const exports = getExports().filter(exp => exp.id !== id);
  localStorage.setItem(EXPORTS_KEY, JSON.stringify(exports));
  localStorage.removeItem(`export-${id}`);
};

export const downloadExport = (images: GameImage[]): void => {
  const exportData = {
    images: images
  };
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', `santa-game-export-${new Date().toISOString()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromFile = async (file: File): Promise<GameImage[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const images = data.images || data;
        if (!Array.isArray(images)) {
          throw new Error('Invalid format: expected an array of images');
        }
        resolve(images);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};