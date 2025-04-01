'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FileUp, Upload, ChevronRight, FileText, CheckCircle, AlertCircle, Loader, Sparkles } from 'lucide-react';

export default function CreateQuizFromPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        toast.success('PDF został pomyślnie przesłany!');
      } else {
        toast.error('Proszę przesłać plik PDF');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        toast.success('PDF został pomyślnie przesłany!');
      } else {
        toast.error('Proszę przesłać plik PDF');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Start symulacji postępu dla lepszego UX
  const startProgressSimulation = () => {
    // Resetuj postęp
    setGenerationProgress(0);
    
    // Symulacja postępu w realistyczny sposób:
    // Przetwarzanie PDF zaczyna się wolno, przyspiesza, a potem zwalnia na końcu
    progressInterval.current = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev < 20) return prev + 0.5; // Początkowa faza
        if (prev < 70) return prev + 1.2; // Faza przyspieszenia
        if (prev < 90) return prev + 0.3; // Faza zwalniania
        return prev; // Pozostaje na 90% do faktycznego ukończenia
      });
    }, 200);
  };

  const stopProgressSimulation = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    // Skok do 100% po ukończeniu
    setGenerationProgress(100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error('Proszę przesłać plik PDF, aby wygenerować quiz');
      return;
    }

    setIsGenerating(true);
    startProgressSimulation();
    
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      toast.loading('Tworzenie Twojego quizu z PDF... Może to potrwać minutę lub dwie.');
      
      const response = await fetch('/api/quiz/pdf', {
        method: 'POST',
        body: formData,
      });

      // Usuń powiadomienie ładowania
      toast.dismiss();
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się wygenerować quizu z PDF');
      }

      const data = await response.json();
      
      stopProgressSimulation();
      setIsGenerating(false);
      
      toast.success(`Quiz "${data.quizTitle || 'Nowy Quiz'}" został pomyślnie utworzony!`);
      
      // Przekieruj użytkownika po krótkim opóźnieniu
      setTimeout(() => {
        router.push(`/courses/${data.id}`);
      }, 1500);
      
    } catch (error) {
      stopProgressSimulation();
      setIsGenerating(false);
      
      toast.error(error instanceof Error ? error.message : 'Nie udało się wygenerować quizu');
      console.error('Error generating quiz:', error);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Generator quizu z PDF
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Prześlij dowolny dokument PDF, a nasza AI przekształci go w interaktywny quiz w kilka sekund.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!pdfFile ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div 
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                        dragActive 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <motion.div 
                        className="mb-4 inline-flex"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                      >
                        <FileUp className="h-12 w-12 text-blue-500" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Przeciągnij i upuść swój PDF tutaj
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        lub kliknij, aby przeglądać swoje pliki
                      </p>
                      <motion.button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Przeglądaj pliki
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start p-6 bg-gray-50 rounded-xl">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{pdfFile.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setPdfFile(null)}
                        className="text-gray-500 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full py-3.5 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={{ scale: isGenerating ? 1 : 1.02, boxShadow: isGenerating ? "" : "0px 6px 15px rgba(66, 153, 225, 0.4)" }}
                      whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                    >
                      {isGenerating ? (
                        <span className="inline-flex items-center">
                          <span className="mr-2">Generowanie quizu...</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center">
                          Utwórz Quiz
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
          
          {/* Animacja ładowania */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                className="px-8 pb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Generowanie quizu...
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {Math.floor(generationProgress)}%
                    </p>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="pt-2 flex items-center justify-center">
                    <div className="flex space-x-8 items-center text-sm text-gray-500 px-5 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Loader className="w-4 h-4 mr-2 text-blue-500 animate-spin" />
                        <span>Odczytywanie PDF</span>
                      </div>
                      
                      <div className={`flex items-center ${generationProgress > 30 ? 'text-blue-600' : 'opacity-50'}`}>
                        <motion.div
                          animate={generationProgress > 30 ? { rotate: 360 } : {}}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                        </motion.div>
                        <span>Tworzenie pytań</span>
                      </div>
                      
                      <div className={`flex items-center ${generationProgress > 70 ? 'text-blue-600' : 'opacity-50'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${generationProgress > 70 ? 'text-green-500' : ''}`} />
                        <span>Finalizacja quizu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jak to działa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileUp className="h-6 w-6 text-blue-500" />,
                title: "Prześlij PDF",
                description: "Po prostu prześlij dowolny dokument PDF zawierający materiał edukacyjny, który chcesz przekonwertować."
              },
              {
                icon: (
                  <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                    <AlertCircle className="h-6 w-6 text-purple-500" />
                  </motion.div>
                ),
                title: "Przetwarzanie AI",
                description: "Nasza zaawansowana AI analizuje treść i tworzy odpowiednie pytania quizowe."
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-green-500" />,
                title: "Gotowy do użycia",
                description: "Otrzymaj interaktywny quiz wraz z odpowiedziami i wyjaśnieniami w kilka sekund."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
