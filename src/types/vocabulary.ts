
export interface VocabularyWord {
  id: number;
  languageA: string;
  languageB: string;
}

export interface VocabularyList {
  id: string;
  name: string;
  words: VocabularyWord[];
}

export type PracticeMode = 'flashcard' | 'multipleChoice' | 'quiz';
