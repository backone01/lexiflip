
import React, { useState, useEffect } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VocabularyWord } from '@/types/vocabulary';
import { toast } from 'sonner';
import QuizQuestion from './quiz/QuizQuestion';
import QuizResults from './quiz/QuizResults';
import QuizHeader from './quiz/QuizHeader';

interface AnswerResult {
  word: VocabularyWord;
  userAnswer: string;
  isCorrect: boolean;
}

const QuizMode = () => {
  const { currentList } = useVocabulary();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (currentList?.words) {
      setWords(currentList.words);
    }
  }, [currentList]);
  
  const currentWord = words[currentWordIndex];
  
  useEffect(() => {
    if (words.length > 0) {
      setProgress(((currentWordIndex + 1) / words.length) * 100);
    }
  }, [currentWordIndex, words]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // Case insensitive comparison
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentWord.languageB.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    setIsAnswerChecked(true);
    
    // Add result to the results array
    setResults(prev => [
      ...prev,
      {
        word: currentWord,
        userAnswer: userAnswer.trim(),
        isCorrect: isAnswerCorrect
      }
    ]);
  };

  const handleNext = () => {
    setUserAnswer('');
    setIsAnswerChecked(false);
    
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRandomize = () => {
    if (isFinished) {
      resetQuiz();
    }
    
    setUserAnswer('');
    setIsAnswerChecked(false);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    setResults([]);
    setIsFinished(false);
    toast.success('Kosakata telah diacak');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isAnswerChecked) {
        checkAnswer();
      } else {
        handleNext();
      }
    }
  };

  const resetQuiz = () => {
    setCurrentWordIndex(0);
    setUserAnswer('');
    setIsAnswerChecked(false);
    setResults([]);
    setIsFinished(false);
  };

  if (!currentWord && !isFinished) {
    return (
      <div className="text-center py-16">
        <p>Tidak ada kata untuk dites</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizResults 
        results={results}
        resetQuiz={resetQuiz}
        handleRandomize={handleRandomize}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <QuizHeader 
        currentWordIndex={currentWordIndex}
        totalWords={words.length}
        handleRandomize={handleRandomize}
      />

      <QuizQuestion
        currentWord={currentWord}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        isAnswerChecked={isAnswerChecked}
        isCorrect={isCorrect}
        handleKeyDown={handleKeyDown}
        progress={progress}
      />

      <div className="flex justify-end gap-3">
        {!isAnswerChecked ? (
          <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
            Periksa
          </Button>
        ) : (
          <Button onClick={handleNext} variant="default" className="flex items-center gap-2">
            {currentWordIndex < words.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
