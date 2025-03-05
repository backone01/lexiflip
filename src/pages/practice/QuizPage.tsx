
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import QuizMode from '@/components/practice/QuizMode';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuizPage = () => {
  const { currentList } = useVocabulary();
  const navigate = useNavigate();
  
  if (!currentList) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Tidak ada daftar kosakata yang dipilih</h2>
            <p className="text-muted-foreground mb-8">
              Silakan pilih daftar kosakata terlebih dahulu
            </p>
            <Button onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" className="flex items-center" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-semibold">{currentList.name}</h1>
          <div className="w-[100px]"></div> {/* For balance */}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Mode Quiz</h2>
          <p className="text-muted-foreground">
            Ketik terjemahan yang benar dan dapatkan nilai di akhir
          </p>
        </div>
        
        <QuizMode />
      </div>
    </Layout>
  );
};

export default QuizPage;
