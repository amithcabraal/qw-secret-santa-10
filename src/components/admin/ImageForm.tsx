import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { GameImage } from '../../types/game';

export const ImageForm: React.FC = () => {
  const { addImage } = useGameStore();
  const [imageUrl, setImageUrl] = useState('');
  const [personName, setPersonName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImage: GameImage = {
      id: Date.now().toString(),
      imageUrl,
      personName,
      maskPosition: { x: 50, y: 30, scale: 1, rotation: 0 }
    };

    addImage(newImage);
    setImageUrl('');
    setPersonName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-lg text-white">Add New Image</h3>
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        required
        className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <input
        type="text"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="Person Name"
        required
        className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add Image
      </Button>
    </form>
  );
};