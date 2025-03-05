
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VocabularyProvider } from "./contexts/VocabularyContext";
import Index from "./pages/Index";
import FlashcardPage from "./pages/practice/FlashcardPage";
import MultipleChoicePage from "./pages/practice/MultipleChoicePage";
import QuizPage from "./pages/practice/QuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VocabularyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/practice/flashcard" element={<FlashcardPage />} />
            <Route path="/practice/multipleChoice" element={<MultipleChoicePage />} />
            <Route path="/practice/quiz" element={<QuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VocabularyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
