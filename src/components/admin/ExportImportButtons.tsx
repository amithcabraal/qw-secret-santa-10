import React, { useRef, useState } from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { downloadExport, importFromFile, saveExport, getExports } from '../../services/gameData';

export const ExportImportButtons: React.FC = () => {
  const { images, importImages } = useGameStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportName, setExportName] = useState('');

  const handleExport = () => {
    downloadExport(images);
  };

  const handleSaveExport = () => {
    if (!exportName.trim()) return;
    saveExport(images, exportName.trim());
    setExportName('');
    setShowExportDialog(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedImages = await importFromFile(file);
      importImages(importedImages);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing images:', error);
      alert('Error importing images. Please check the file format.');
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleExport}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Export Images
        </Button>
        
        <Button
          onClick={() => setShowExportDialog(true)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Export
        </Button>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Upload size={18} />
          Import Images
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>

      {showExportDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Save Export</h2>
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              placeholder="Enter export name"
              className="w-full p-2 rounded bg-gray-700 mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveExport} className="flex-1">Save</Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowExportDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};