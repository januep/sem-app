'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

export default function CreateQuizPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Proszę wprowadzić treść polecenia, aby wygenerować quiz.');
      return;
    }
    
    setIsGenerating(true);
    toast.loading('Generowanie quizu... To może potrwać chwilę.', { id: 'generating' });
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nie udało się wygenerować quizu');
      }
      
      const data = await response.json();
      
      toast.success(`Quiz "${data.quizTitle}" został pomyślnie wygenerowany i zapisany!`, { 
        id: 'generating', 
        duration: 3000 
      });
      
      setTimeout(() => {
        router.push(`/courses/${data.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd', { id: 'generating' });
    } finally {
      setIsGenerating(false);
    }
  }
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-4xl mx-auto p-6 md:p-8"
    >
      
      
      <motion.div 
        className="text-center mb-8"
        variants={fadeIn}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Stwórz quiz przy użyciu AI
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Opisz quiz, który chcesz utworzyć, a nasza AI go wygeneruje.
        </p>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6 md:p-8"
        variants={fadeIn}
        whileHover={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Opis quizu
            </label>
            <motion.div 
              className="relative"
              whileTap={{ scale: 0.995 }}
            >
              <textarea
                id="prompt"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Np. Utwórz quiz o wojnie secesyjnej w USA z 5 pytaniami wielokrotnego wyboru, 2 pytaniami prawda/fałsz i 1 pytaniem dopasowującym."
                className="block w-full rounded-md border border-gray-300 shadow-sm 
                           focus:border-indigo-500 focus:ring-indigo-500 
                           text-gray-900 text-base py-3 px-4
                           placeholder:text-gray-500 placeholder:font-normal"
                disabled={isGenerating}
              />
            </motion.div>
            <p className="mt-2 text-xs text-gray-600">
              Bądź precyzyjny w opisie tematu, poziomu trudności oraz rodzajów pytań, których oczekujesz.
            </p>
          </div>
          
          <div className="flex items-center justify-end">
            <motion.button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className={`
                flex items-center justify-center rounded-md px-5 py-3 text-base font-medium text-white
                ${isGenerating || !prompt.trim() 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600'}
              `}
              whileHover={!isGenerating && prompt.trim() ? { scale: 1.02, backgroundColor: "#4338ca" } : {}}
              whileTap={!isGenerating && prompt.trim() ? { scale: 0.98 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generowanie...
                </>
              ) : (
                'Generuj quiz'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
