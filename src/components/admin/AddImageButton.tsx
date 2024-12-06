import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { GameImage } from '../../types/game';

export const AddImageButton: React.FC = () => {
  const { addImage } = useGameStore();
  const [isAdding, setIsAdding] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [personName, setPersonName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImage: GameImage = {
      id: Date.now().toString(),
      imageUrl,
      personName,
      maskPosition: { x: 50, y: 30, scale: 1, rotation: 0 },
      showMask: true
    };

    addImage(newImage);
    setImageUrl('');
    setPersonName('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 z-10">
        <Plus size={18} />
        Add New Image
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6">Add New Image</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full p-2 rounded bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Person Name</label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Enter name"
              required
              className="w-full p-2 rounded bg-gray-700"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">Add Image</Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsAdding(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};