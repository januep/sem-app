// src/components/BulkQuizGenerator.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  Clock, 
  Loader, 
  AlertCircle,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Chunk {
  id: string;
  start_page: number;
  end_page: number;
  order: number;
}

interface Quiz {
  id: string;
  chunk_id: string;
}

interface BulkQuizGeneratorProps {
  chunks: Chunk[];
  existingQuizzes: Quiz[];
  onQuizGenerated: () => void; // callback do odświeżenia strony
}

interface GenerationProgress {
  chunkId: string;
  status: 'waiting' | 'generating' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  error?: string;
}

export default function BulkQuizGenerator({ 
  chunks, 
  existingQuizzes, 
  onQuizGenerated 
}: BulkQuizGeneratorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress[]>([]);
  const [totalStartTime, setTotalStartTime] = useState<number | null>(null);

  // Obliczanie statystyk
  const existingQuizChunkIds = new Set(existingQuizzes.map(quiz => quiz.chunk_id));
  const chunksWithoutQuiz = chunks.filter(chunk => !existingQuizChunkIds.has(chunk.id));
  const totalChunks = chunks.length;
  const completedQuizzes = existingQuizzes.length;
  const remainingQuizzes = chunksWithoutQuiz.length;

  // Jeśli wszystkie quizy są już wygenerowane, nie pokazuj komponentu
  if (remainingQuizzes === 0) {
    return null;
  }

  const openModal = () => {
    setIsModalOpen(true);
    // Inicjalizacja stanu progress dla chunków bez quizów
    const initialProgress = chunksWithoutQuiz.map(chunk => ({
      chunkId: chunk.id,
      status: 'waiting' as const
    }));
    setProgress(initialProgress);
  };

  const closeModal = () => {
    if (!isGenerating) {
      setIsModalOpen(false);
      setProgress([]);
    }
  };

  const generateQuizForChunk = async (chunk: Chunk): Promise<boolean> => {
    try {
      // Pobierz tekst chunk'a
      const chunkResponse = await fetch(`/api/chunks/${chunk.id}`);
      if (!chunkResponse.ok) {
        throw new Error('Nie udało się pobrać danych chunk\'a');
      }
      const chunkData = await chunkResponse.json();

      // Generuj quiz
      const response = await fetch('/api/generate-chunk-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chunkId: chunk.id,
          chunkText: chunkData.text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się wygenerować quizu');
      }

      return true;
    } catch (error) {
      console.error(`Błąd generowania quizu dla chunk'a ${chunk.id}:`, error);
      throw error;
    }
  };

  const startBulkGeneration = async () => {
    setIsGenerating(true);
    setTotalStartTime(Date.now());

    for (let i = 0; i < chunksWithoutQuiz.length; i++) {
      const chunk = chunksWithoutQuiz[i];
      const startTime = Date.now();

      // Aktualizuj status na "generating"
      setProgress(prev => prev.map(p => 
        p.chunkId === chunk.id 
          ? { ...p, status: 'generating', startTime }
          : p
      ));

      try {
        await generateQuizForChunk(chunk);
        
        const endTime = Date.now();
        
        // Aktualizuj status na "completed"
        setProgress(prev => prev.map(p => 
          p.chunkId === chunk.id 
            ? { ...p, status: 'completed', endTime }
            : p
        ));

        toast.success(`Quiz dla sekcji ${chunk.start_page}-${chunk.end_page} wygenerowany!`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
        
        // Aktualizuj status na "error"
        setProgress(prev => prev.map(p => 
          p.chunkId === chunk.id 
            ? { ...p, status: 'error', error: errorMessage }
            : p
        ));

        toast.error(`Błąd przy sekcji ${chunk.start_page}-${chunk.end_page}: ${errorMessage}`);
      }
    }

    setIsGenerating(false);
    onQuizGenerated(); // Odśwież stronę główną
    
    // Pokazuj podsumowanie przez 3 sekundy, potem zamknij modal
    setTimeout(() => {
      setIsModalOpen(false);
      setProgress([]);
      setTotalStartTime(null);
    }, 3000);
  };

  const formatTime = (startTime?: number, endTime?: number) => {
    if (!startTime) return '--';
    const duration = endTime ? endTime - startTime : Date.now() - startTime;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getChunkByProgress = (progressItem: GenerationProgress) => {
    return chunks.find(chunk => chunk.id === progressItem.chunkId);
  };

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const errorCount = progress.filter(p => p.status === 'error').length;

  return (
    <>
      {/* Przycisk uruchamiający */}
      <motion.button
        onClick={openModal}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Generuj quizy dla wszystkich sekcji
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Masowe generowanie quizów</h2>
                  </div>
                  {!isGenerating && (
                    <button
                      onClick={closeModal}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Statystyki */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{totalChunks}</div>
                    <div className="text-sm text-gray-600">Łącznie sekcji</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedQuizzes}</div>
                    <div className="text-sm text-gray-600">Gotowe quizy</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{remainingQuizzes}</div>
                    <div className="text-sm text-gray-600">Do wygenerowania</div>
                  </div>
                </div>

                {/* Przycisk startu lub progress */}
                {!isGenerating && progress.length === 0 ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Wygeneruj quizy dla wszystkich {remainingQuizzes} pozostałych sekcji naraz. 
                      Proces może potrwać kilka minut.
                    </p>
                    <motion.button
                      onClick={startBulkGeneration}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-5 h-5 mr-3" />
                      Rozpocznij generowanie
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Ogólny progress */}
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          Postęp: {completedCount + errorCount} / {progress.length}
                        </span>
                        {totalStartTime && (
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(totalStartTime)}
                          </span>
                        )}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((completedCount + errorCount) / progress.length) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{completedCount} ukończonych</span>
                        <span>{errorCount} błędów</span>
                      </div>
                    </div>

                    {/* Lista sekcji */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {progress.map((progressItem) => {
                        const chunk = getChunkByProgress(progressItem);
                        if (!chunk) return null;

                        return (
                          <motion.div
                            key={progressItem.chunkId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              progressItem.status === 'completed' 
                                ? 'border-green-200 bg-green-50' 
                                : progressItem.status === 'error'
                                ? 'border-red-200 bg-red-50'
                                : progressItem.status === 'generating'
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {progressItem.status === 'completed' && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                              {progressItem.status === 'generating' && (
                                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                              )}
                              {progressItem.status === 'error' && (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                              {progressItem.status === 'waiting' && (
                                <Clock className="w-5 h-5 text-gray-400" />
                              )}
                              
                              <div>
                                <div className="font-medium text-gray-900">
                                  Sekcja {chunk.start_page}–{chunk.end_page}
                                </div>
                                {progressItem.error && (
                                  <div className="text-xs text-red-600">
                                    {progressItem.error}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              {formatTime(progressItem.startTime, progressItem.endTime)}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Status completion */}
                    {!isGenerating && (completedCount + errorCount) === progress.length && (
                      <div className="text-center mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-800 mb-1">Generowanie zakończone!</h3>
                        <p className="text-sm text-green-700">
                          Pomyślnie: {completedCount}, Błędy: {errorCount}
                        </p>
                        <p className="text-xs text-green-600 mt-2">Modal zamknie się automatycznie...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}