
import React from 'react';
import Layout from '@/components/layout/Layout';
import UploadForm from '@/components/vocabulary/UploadForm';
import VocabularyListSelector from '@/components/vocabulary/VocabularyListSelector';
import PracticeModeSelector from '@/components/practice/PracticeModeSelector';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { currentList, vocabularyLists } = useVocabulary();
  
  return (
    <Layout>
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">LexiFlip</h1>
          <p className="text-xl text-muted-foreground">
            Aplikasi latihan kosakata interaktif untuk meningkatkan kemampuan bahasa Anda
          </p>
        </div>
        
        {vocabularyLists.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="glass-morphism p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-center">Mulai Pembelajaran</h2>
              <p className="text-muted-foreground mb-8 text-center">
                Unggah file Excel dengan daftar kosakata untuk mulai berlatih
              </p>
              <UploadForm />
            </div>
          </div>
        ) : (
          <>
            <VocabularyListSelector />
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Mode Latihan</h2>
              <PracticeModeSelector disabled={!currentList} />
            </div>
            
            {!currentList && (
              <div className="text-center p-4 rounded-lg bg-secondary/50 text-muted-foreground">
                Pilih daftar kosakata terlebih dahulu untuk mulai berlatih
              </div>
            )}
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-medium mb-4">Ingin menambahkan daftar kosakata baru?</h3>
              <div className="max-w-md mx-auto">
                <UploadForm />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
