
import React, { useState, useEffect, useCallback } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { Check, X, ChevronRight, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VocabularyWord } from '@/types/vocabulary';
import { toast } from 'sonner';

const MultipleChoiceMode = () => {
  const { currentList } = useVocabulary();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentList?.words) {
      setWords(currentList.words);
    }
  }, [currentList]);

  const currentWord = words[currentWordIndex];

  const generateOptions = useCallback(() => {
    if (!currentWord || words.length < 4) return [];
    
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
    return allOptions.sort(() => Math.random() - 0.5);
  }, [currentWord, currentWordIndex, words]);

  useEffect(() => {
    if (words.length > 0) {
      setOptions(generateOptions());
      setSelectedOption(null);
      setIsCorrect(null);
      setProgress(((currentWordIndex + 1) / words.length) * 100);
    }
  }, [currentWordIndex, words, generateOptions]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(option);
    const correct = option === currentWord.languageB;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Quiz finished
      console.log('Quiz completed with score:', score);
    }
  };

  const handleRandomize = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    setScore(0);
    toast.success('Kosakata telah diacak');
  };

  const getOptionClass = (option: string) => {
    if (selectedOption === null) return '';
    
    if (option === currentWord.languageB) {
      return 'border-green-500 bg-green-50';
    }
    
    if (option === selectedOption && option !== currentWord.languageB) {
      return 'border-red-500 bg-red-50';
    }
    
    return 'opacity-50';
  };

  if (!currentWord || words.length < 4) {
    return (
      <div className="text-center py-16">
        <p>Anda perlu minimal 4 kata untuk mode pilihan ganda</p>
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

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Pertanyaan {currentWordIndex + 1} dari {words.length}
        </p>
        <div className="flex items-center gap-4">
          <p className="font-medium">
            Skor: {score}/{currentWordIndex + (selectedOption ? 1 : 0)}
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
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fade-in">
        <h2 className="text-lg font-medium mb-4">Terjemahkan ke Bahasa B:</h2>
        <div className="flex items-center justify-center">
          <h3 className="text-3xl font-bold py-8">{currentWord.languageA}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            className={`p-4 rounded-lg border text-left transition-all ${
              getOptionClass(option)
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
          >
            <div className="flex items-center">
              <span className="flex-1">{option}</span>
              {selectedOption === option && isCorrect && (
                <Check className="text-green-500 ml-2" />
              )}
              {selectedOption === option && !isCorrect && (
                <X className="text-red-500 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedOption && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="flex items-center gap-2 px-6">
            {currentWordIndex < words.length - 1 ? 'Selanjutnya' : 'Selesai'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceMode;
