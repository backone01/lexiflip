
import React, { useState, useEffect, useRef } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VocabularyWord } from '@/types/vocabulary';

interface AnswerResult {
  word: VocabularyWord;
  userAnswer: string;
  isCorrect: boolean;
}

const QuizMode = () => {
  const { currentList } = useVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const words = currentList?.words || [];
  const currentWord = words[currentWordIndex];
  
  useEffect(() => {
    if (words.length > 0) {
      setProgress(((currentWordIndex + 1) / words.length) * 100);
    }
    
    // Focus the input when the current word changes
    if (inputRef.current) {
      inputRef.current.focus();
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isAnswerChecked) {
        checkAnswer();
      } else {
        handleNext();
      }
    }
  };

  const calculateScore = () => {
    const correctAnswers = results.filter(result => result.isCorrect).length;
    return {
      correct: correctAnswers,
      total: results.length,
      percentage: Math.round((correctAnswers / results.length) * 100)
    };
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
    const score = calculateScore();
    
    return (
      <div className="max-w-xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Hasil Quiz</h2>
          
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2">{score.percentage}%</div>
            <p className="text-muted-foreground">
              {score.correct} benar dari {score.total} pertanyaan
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {result.isCorrect ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{result.word.languageA}</p>
                    <div className="mt-1 text-sm">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">Jawaban Anda:</span> 
                        <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {result.userAnswer}
                        </span>
                      </div>
                      {!result.isCorrect && (
                        <div className="flex items-center mt-1">
                          <span className="text-muted-foreground mr-2">Jawaban Benar:</span>
                          <span className="text-green-600">{result.word.languageB}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={resetQuiz} size="lg">
              Mulai Quiz Baru
            </Button>
          </div>
        </div>
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

      <div className="text-center mb-2 text-muted-foreground">
        <p>Pertanyaan {currentWordIndex + 1} dari {words.length}</p>
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

      <div className="flex justify-end gap-3">
        {!isAnswerChecked ? (
          <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
            Periksa
          </Button>
        ) : (
          <Button onClick={handleNext} variant="default">
            {currentWordIndex < words.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
