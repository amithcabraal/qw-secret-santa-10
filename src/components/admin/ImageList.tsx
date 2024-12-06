import React, { useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { GameImage } from '../../types/game';

export const ImageList: React.FC = () => {
  const { images, updateImage, deleteImage } = useGameStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GameImage>>({});

  const handleEdit = (image: GameImage) => {
    setEditingId(image.id);
    setEditForm(image);
  };

  const handleSave = (id: string) => {
    updateImage(id, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage(id);
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-lg text-white">Image List</h3>
      {images.map((image) => (
        <div key={image.id} className="bg-gray-700 rounded-lg p-4 space-y-2">
          {editingId === image.id ? (
            <div className="space-y-2">
              <input
                type="url"
                value={editForm.imageUrl || ''}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="Image URL"
              />
              <input
                type="text"
                value={editForm.personName || ''}
                onChange={(e) => setEditForm({ ...editForm, personName: e.target.value })}
                className="w-full p-2 rounded bg-gray-600 text-white"
                placeholder="Person Name"
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleSave(image.id)}
                  className="flex items-center gap-1"
                >
                  <Save size={16} />
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="flex items-center gap-1"
                >
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">{image.personName}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="icon"
                    onClick={() => handleEdit(image)}
                    className="p-1"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="icon"
                    onClick={() => handleDelete(image.id)}
                    className="p-1"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <img
                src={image.imageUrl}
                alt={image.personName}
                className="w-full h-32 object-cover rounded"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};