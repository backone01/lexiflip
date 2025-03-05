
import React, { useRef, useState } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { FileUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UploadForm = () => {
  const { uploadVocabulary, isLoading } = useVocabulary();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
        file.type !== 'application/vnd.ms-excel') {
      console.error('File type not supported');
      return;
    }
    uploadVocabulary(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`upload-area flex flex-col items-center justify-center ${dragActive ? 'border-primary bg-primary/5' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".xlsx,.xls"
        />
        <FileUp className="w-12 h-12 text-primary/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Unggah File Excel</h3>
        <p className="text-center text-muted-foreground text-sm mb-4">
          Seret file Excel atau klik untuk memilih
        </p>
        <p className="text-xs text-muted-foreground">
          Format: Kolom 1 untuk bahasa A, Kolom 2 untuk bahasa B
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="w-4 h-4" />
          Pilih File
        </Button>
      </div>
    </div>
  );
};

export default UploadForm;
