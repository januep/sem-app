// src/app/learn/[id]/chunk/[chunkId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FileText, 
  BookOpen, 
  Plus, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Hash,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Chunk {
  id: string;
  pdf_id: string;
  start_page: number;
  end_page: number;
  text: string;
  token_count: number;
  order: number;
  created_at: string;
  updated_at: string;
}

interface ExistingQuiz {
  id: string;
  quizTitle: string;
  description: string;
  approximateTime: number;
  heroIconName: string;
  questions: unknown[];
  created_at: string;
}

export default function ChunkQuizPage() {
  const params = useParams();
  const router = useRouter();
  const learnId = params.id as string;
  const chunkId = params.chunkId as string;
  
  const [chunk, setChunk] = useState<Chunk | null>(null);
  const [existingQuiz, setExistingQuiz] = useState<ExistingQuiz | null>(null);
  const [isLoadingChunk, setIsLoadingChunk] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie danych fragmentu
  useEffect(() => {
    const fetchChunk = async () => {
      setIsLoadingChunk(true);
      setError(null);
      
      try {
        // Endpoint API do pobierania fragmentu po ID
        const response = await fetch(`/api/chunks/${chunkId}`);
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych fragmentu');
        }
        
        const chunkData = await response.json();
        setChunk(chunkData);
        
        // Sprawdzenie czy istnieje już quiz dla tego fragmentu
        const quizResponse = await fetch(`/api/quizzes/chunk/${chunkId}`);
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          setExistingQuiz(quizData);
        }
        
      } catch (err: unknown) {
        console.error('Błąd podczas pobierania fragmentu:', err);
        const errorMessage = err instanceof Error ? err.message : 'Nie udało się załadować fragmentu';
        setError(errorMessage);
      } finally {
        setIsLoadingChunk(false);
      }
    };

    if (chunkId) {
      fetchChunk();
    }
  }, [chunkId]);

  const handleCreateQuiz = async () => {
    if (!chunk) {
      toast.error('Dane fragmentu nie są dostępne');
      return;
    }

    setIsGeneratingQuiz(true);
    
    try {
      toast.loading('Tworzenie quizu z zawartości fragmentu... To może potrwać chwilę.', { id: 'generating-quiz' });
      
      const response = await fetch('/api/generate-chunk-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chunkId: chunk.id,
          chunkText: chunk.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się wygenerować quizu');
      }

      const data = await response.json();
      
      toast.success(`Quiz "${data.quizTitle}" został utworzony pomyślnie!`, { 
        id: 'generating-quiz',
        duration: 3000 
      });
      
      // Przekierowanie do quizu po krótkiej przerwie
      setTimeout(() => {
        router.push(`/courses/${data.id}`);
      }, 1500);
      
    } catch (error: unknown) {
      console.error('Błąd podczas generowania quizu:', error);
      const errorMessage = error instanceof Error ? error.message : 'Nie udało się wygenerować quizu';
      toast.error(errorMessage, { id: 'generating-quiz' });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  if (isLoadingChunk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Ładowanie zawartości fragmentu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Błąd ładowania zawartości</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href={`/learn/${learnId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do nauki
          </Link>
        </div>
      </div>
    );
  }

  if (!chunk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fragment nie znaleziony</h1>
          <p className="text-gray-600">Żądany fragment zawartości nie został znaleziony.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href={`/learn/${learnId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do nauki
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz fragmentu zawartości
          </h1>
          <p className="text-gray-600">
            Utwórz lub zobacz zawartość quizu dla tego fragmentu nauki
          </p>
        </motion.div>

        {/* Informacje o fragmencie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Informacje o fragmencie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Strony:</span>
              <span className="font-medium">{chunk.start_page} - {chunk.end_page}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tokeny:</span>
              <span className="font-medium">{chunk.token_count.toLocaleString('pl-PL')}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Kolejność:</span>
              <span className="font-medium">#{chunk.order}</span>
            </div>
          </div>
          
          {/* Podgląd tekstu */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Podgląd zawartości:</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                {chunk.text.substring(0, 300)}
                {chunk.text.length > 300 && '...'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sekcja quizu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {existingQuiz ? (
            // Pokaż istniejący quiz
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Istniejący quiz
              </h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">{existingQuiz.quizTitle}</h3>
                <p className="text-green-700 text-sm mb-3">{existingQuiz.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-green-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {existingQuiz.approximateTime} minut
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {existingQuiz.questions.length} pytań
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link
                  href={`/courses/${existingQuiz.id}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Rozpocznij quiz
                </Link>
                
                <button
                  onClick={handleCreateQuiz}
                  disabled={isGeneratingQuiz}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isGeneratingQuiz ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingQuiz ? 'Regenerowanie...' : 'Utwórz nowy quiz'}
                </button>
              </div>
            </div>
          ) : (
            // Pokaż opcję tworzenia quizu
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Utwórz quiz
              </h2>
              
              <p className="text-gray-600 mb-6">
                Wygeneruj interaktywny quiz na podstawie tego fragmentu zawartości. AI przeanalizuje tekst 
                i utworzy odpowiednie pytania do sprawdzenia zrozumienia i zapamiętywania.
              </p>
              
              <motion.button
                onClick={handleCreateQuiz}
                disabled={isGeneratingQuiz}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg"
                whileHover={{ scale: isGeneratingQuiz ? 1 : 1.02 }}
                whileTap={{ scale: isGeneratingQuiz ? 1 : 0.98 }}
              >
                {isGeneratingQuiz ? (
                  <>
                    <Loader className="w-5 h-5 mr-3 animate-spin" />
                    Tworzenie quizu...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-3" />
                    Utwórz nowy quiz
                  </>
                )}
              </motion.button>
              
              {isGeneratingQuiz && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>To może potrwać 30-60 sekund w zależności od długości zawartości.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}