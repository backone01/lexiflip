
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VocabularyList, VocabularyWord } from '@/types/vocabulary';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface VocabularyContextType {
  vocabularyLists: VocabularyList[];
  currentList: VocabularyList | null;
  uploadVocabulary: (file: File) => Promise<void>;
  selectList: (listId: string) => void;
  isLoading: boolean;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};

export const VocabularyProvider = ({ children }: { children: ReactNode }) => {
  const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
  const [currentList, setCurrentList] = useState<VocabularyList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadVocabulary = async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json<{ [key: string]: string }>(worksheet);
      
      if (data.length === 0) {
        toast.error('File tidak berisi data yang valid');
        setIsLoading(false);
        return;
      }
      
      // Get the column headers
      const headers = Object.keys(data[0]);
      if (headers.length < 2) {
        toast.error('File harus memiliki minimal 2 kolom');
        setIsLoading(false);
        return;
      }
      
      // Create the vocabulary words
      const words: VocabularyWord[] = data.map((row, index) => ({
        id: index + 1,
        languageA: row[headers[0]] || '',
        languageB: row[headers[1]] || ''
      }));
      
      const newList: VocabularyList = {
        id: Date.now().toString(),
        name: file.name.replace(/\.\w+$/, ''),
        words
      };
      
      setVocabularyLists(prev => [...prev, newList]);
      setCurrentList(newList);
      
      toast.success(`Berhasil mengunggah ${words.length} kata`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Gagal memproses file. Pastikan format sesuai');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectList = (listId: string) => {
    const list = vocabularyLists.find(list => list.id === listId);
    if (list) {
      setCurrentList(list);
    }
  };

  return (
    <VocabularyContext.Provider value={{
      vocabularyLists,
      currentList,
      uploadVocabulary,
      selectList,
      isLoading
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};
