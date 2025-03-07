
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface QuizHeaderProps {
  currentWordIndex: number;
  totalWords: number;
  handleRandomize: () => void;
}

const QuizHeader = ({ currentWordIndex, totalWords, handleRandomize }: QuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <p className="text-muted-foreground">
        Pertanyaan {currentWordIndex + 1} dari {totalWords}
      </p>
      <Button 
        variant="secondary" 
        size="sm" 
        className="flex items-center gap-1 rounded-full"
        onClick={handleRandomize}
      >
        <Shuffle className="h-4 w-4" />
        <span>Acak</span>
      </Button>
    </div>
  );
};

export default QuizHeader;
