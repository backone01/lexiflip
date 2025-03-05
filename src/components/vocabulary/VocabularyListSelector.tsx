
import React from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { Check, FileText } from 'lucide-react';

const VocabularyListSelector = () => {
  const { vocabularyLists, currentList, selectList } = useVocabulary();

  if (vocabularyLists.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">Daftar Kosakata</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vocabularyLists.map((list) => (
          <div
            key={list.id}
            className={`p-4 rounded-lg border ${
              currentList?.id === list.id
                ? 'border-primary bg-primary/10'
                : 'hover:bg-secondary/50'
            } cursor-pointer transition-colors`}
            onClick={() => selectList(list.id)}
          >
            <div className="flex items-center gap-3">
              <FileText className="text-primary w-5 h-5" />
              <div className="flex-1">
                <h3 className="font-medium">{list.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {list.words.length} kata
                </p>
              </div>
              {currentList?.id === list.id && (
                <Check className="text-primary w-5 h-5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyListSelector;
