
import React, { useState, useEffect, useCallback } from 'react';
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
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
      generateOptions();
    }
  }, [currentWordIndex, words]);

  const generateOptions = useCallback(() => {
    if (!currentWord || words.length < 4) {
      setOptions([]);
      return;
    }
    
    // Get the correct answer
    const correctAnswer = currentWord.languageB;
    
    // Get 3 random incorrect answers
    const incorrectOptions: string[] = [];
    const usedIndexes = new Set([currentWordIndex]);
    
    while (incorrectOptions.length < 3 && incorrectOptions.length < words.length - 1) {
      const randomIndex = Math.floor(Math.random() * words.length);
      if (!usedIndexes.has(randomIndex) && words[randomIndex].languageB !== correctAnswer) {
        usedIndexes.add(randomIndex);
        incorrectOptions.push(words[randomIndex].languageB);
      }
    }
    
    // Combine and shuffle all options
    const allOptions = [...incorrectOptions, correctAnswer];
    setOptions(allOptions.sort(() => Math.random() - 0.5));
  }, [currentWord, currentWordIndex, words]);

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    
    setSelectedOption(option);
    const correct = option === currentWord.languageB;
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    
    // Add result to the results array
    setResults(prev => [
      ...prev,
      {
        word: currentWord,
        userAnswer: option,
        isCorrect: correct
      }
    ]);
  };

  const handleNext = () => {
    setSelectedOption(null);
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
    
    setSelectedOption(null);
    setIsAnswerChecked(false);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    setResults([]);
    setIsFinished(false);
    toast.success('Kosakata telah diacak');
  };

  const resetQuiz = () => {
    setCurrentWordIndex(0);
    setSelectedOption(null);
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
        options={options}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        isAnswerChecked={isAnswerChecked}
        isCorrect={isCorrect}
        progress={progress}
      />

      {isAnswerChecked && (
        <div className="flex justify-end">
          <Button onClick={handleNext} variant="default" className="flex items-center gap-2">
            {currentWordIndex < words.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizMode;
