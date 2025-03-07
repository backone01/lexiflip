
import React, { useRef, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { VocabularyWord } from '@/types/vocabulary';

interface QuizQuestionProps {
  currentWord: VocabularyWord;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  progress: number;
}

const QuizQuestion = ({
  currentWord,
  userAnswer,
  setUserAnswer,
  isAnswerChecked,
  isCorrect,
  handleKeyDown,
  progress
}: QuizQuestionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus the input when the current word changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord]);

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

      <div className="mb-6">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnswerChecked}
            placeholder="Ketik jawaban Anda di sini..."
            className={`word-input w-full ${
              isAnswerChecked 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : ''
            }`}
            autoFocus
          />
          
          {isAnswerChecked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <XCircle className="text-red-500 h-5 w-5" />
              )}
            </div>
          )}
        </div>
        
        {isAnswerChecked && !isCorrect && (
          <div className="mt-2 text-sm flex items-center text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Jawaban yang benar: <span className="font-medium text-foreground">{currentWord.languageB}</span></span>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizQuestion;
