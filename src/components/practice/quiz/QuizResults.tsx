
import React from 'react';
import { CheckCircle, XCircle, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VocabularyWord } from '@/types/vocabulary';

interface AnswerResult {
  word: VocabularyWord;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizResultsProps {
  results: AnswerResult[];
  resetQuiz: () => void;
  handleRandomize: () => void;
}

const QuizResults = ({ results, resetQuiz, handleRandomize }: QuizResultsProps) => {
  const calculateScore = () => {
    const correctAnswers = results.filter(result => result.isCorrect).length;
    return {
      correct: correctAnswers,
      total: results.length,
      percentage: Math.round((correctAnswers / results.length) * 100)
    };
  };

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
                      <span className="text-muted-foreground mr-2">Pilihan Anda:</span> 
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
        
        <div className="flex justify-center gap-3">
          <Button onClick={resetQuiz} size="lg">
            Mulai Quiz Baru
          </Button>
          <Button onClick={handleRandomize} variant="secondary" size="lg" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Acak dan Mulai Lagi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
