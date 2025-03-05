
import React from 'react';
import { Link } from 'react-router-dom';
import { PracticeMode } from '@/types/vocabulary';
import { BookOpen, CheckSquare, FileQuestion } from 'lucide-react';

interface PracticeModeOption {
  id: PracticeMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const modes: PracticeModeOption[] = [
  {
    id: 'flashcard',
    title: 'Mode Hafalan',
    description: 'Pelajari kosakata dengan kartu interaktif yang bisa dibalik',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'bg-blue-50 text-blue-500',
  },
  {
    id: 'multipleChoice',
    title: 'Mode Pilihan Ganda',
    description: 'Latihan dengan memilih jawaban yang benar dari 4 pilihan',
    icon: <CheckSquare className="w-8 h-8" />,
    color: 'bg-green-50 text-green-500',
  },
  {
    id: 'quiz',
    title: 'Mode Quiz',
    description: 'Uji kemampuanmu dengan menjawab pertanyaan dan dapatkan skor',
    icon: <FileQuestion className="w-8 h-8" />,
    color: 'bg-purple-50 text-purple-500',
  },
];

interface PracticeModeSelectorProps {
  disabled?: boolean;
}

const PracticeModeSelector: React.FC<PracticeModeSelectorProps> = ({ disabled = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {modes.map((mode) => (
        <Link
          key={mode.id}
          to={disabled ? '#' : `/practice/${mode.id}`}
          className={`mode-card ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className={`w-14 h-14 rounded-full ${mode.color} flex items-center justify-center mb-4`}>
            {mode.icon}
          </div>
          <h3 className="text-lg font-medium mb-2">{mode.title}</h3>
          <p className="text-sm text-muted-foreground">{mode.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default PracticeModeSelector;
