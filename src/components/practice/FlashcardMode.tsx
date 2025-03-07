
import React, { useState, useEffect } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VocabularyWord } from '@/types/vocabulary';
import { toast } from 'sonner';

const FlashcardMode = () => {
  const { currentList } = useVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [words, setWords] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    if (currentList?.words) {
      setWords(currentList.words);
    }
  }, [currentList]);

  useEffect(() => {
    if (words.length > 0) {
      setProgress(((currentWordIndex + 1) / words.length) * 100);
    }
  }, [currentWordIndex, words]);

  const currentWord = words[currentWordIndex] || null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev));
    }, 200);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, 200);
  };

  const handleRestart = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentWordIndex(0);
    }, 200);
  };

  const handleRandomize = () => {
    setIsFlipped(false);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    toast.success('Kosakata telah diacak');
  };

  if (!currentWord) {
    return (
      <div className="text-center py-16">
        <p>Tidak ada kata untuk dipelajari</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="relative h-4 bg-secondary rounded-full mb-8 overflow-hidden">
        <div 
          className="absolute h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center mb-6 text-muted-foreground">
        <p>Kartu {currentWordIndex + 1} dari {words.length}</p>
      </div>

      <div className="aspect-[3/2] mb-8">
        <div className={`flashcard h-full ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front glass-morphism">
              <div className="text-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Bahasa A</span>
                <h2 className="text-3xl font-bold">{currentWord.languageA}</h2>
                <p className="mt-6 text-sm text-muted-foreground">Klik untuk membalik</p>
              </div>
            </div>
            <div className="flashcard-back glass-morphism">
              <div className="text-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Bahasa B</span>
                <h2 className="text-3xl font-bold">{currentWord.languageB}</h2>
                <p className="mt-6 text-sm text-muted-foreground">Klik untuk membalik</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRestart} className="rounded-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            <span>Mulai Ulang</span>
          </Button>
          
          <Button variant="secondary" onClick={handleRandomize} className="rounded-full">
            <Shuffle className="h-4 w-4 mr-2" />
            <span>Acak</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentWordIndex === words.length - 1}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
};

export default FlashcardMode;
