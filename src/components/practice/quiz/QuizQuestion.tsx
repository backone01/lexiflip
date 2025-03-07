
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { VocabularyWord } from '@/types/vocabulary';

interface QuizQuestionProps {
  currentWord: VocabularyWord;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  progress: number;
}

const QuizQuestion = ({
  currentWord,
  options,
  selectedOption,
  onSelectOption,
  isAnswerChecked,
  isCorrect,
  progress
}: QuizQuestionProps) => {
  
  const getOptionClassName = (option: string) => {
    if (!isAnswerChecked) return "p-4 rounded-lg border text-left transition-all";
    
    if (option === currentWord.languageB) {
      return "p-4 rounded-lg border text-left transition-all border-green-500 bg-green-50";
    }
    
    if (option === selectedOption && option !== currentWord.languageB) {
      return "p-4 rounded-lg border text-left transition-all border-red-500 bg-red-50";
    }
    
    return "p-4 rounded-lg border text-left transition-all opacity-50";
  };

  return (
    <>
      <div className="relative h-4 bg-secondary rounded-full mb-8 overflow-hidden">
        <div 
          className="absolute h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fade-in">
        <h2 className="text-lg font-medium mb-4">Terjemahkan ke Bahasa B:</h2>
        <div className="flex items-center justify-center">
          <h3 className="text-3xl font-bold py-4">{currentWord.languageA}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(option)}
            onClick={() => onSelectOption(option)}
            disabled={isAnswerChecked}
          >
            <div className="flex items-center">
              <span className="flex-1">{option}</span>
              {selectedOption === option && isAnswerChecked && isCorrect && (
                <CheckCircle className="text-green-500 ml-2 h-5 w-5" />
              )}
              {selectedOption === option && isAnswerChecked && !isCorrect && (
                <XCircle className="text-red-500 ml-2 h-5 w-5" />
              )}
            </div>
          </button>
        ))}
      </div>

      {isAnswerChecked && !isCorrect && (
        <div className="mt-2 mb-4 text-sm flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Jawaban yang benar: <span className="font-medium text-foreground">{currentWord.languageB}</span></span>
        </div>
      )}
    </>
  );
};

export default QuizQuestion;
