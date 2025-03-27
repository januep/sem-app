import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FillBlanksQuestion } from '../../types/quiz';

interface FillBlanksProps {
  question: FillBlanksQuestion;
  onNext: (answer: string) => void;
}

const FillBlanks: React.FC<FillBlanksProps> = ({ question, onNext }) => {
  const [input, setInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Format prompt to highlight blanks
  const formatPrompt = () => {
    // If the prompt already contains underscores or blanks indicator,
    // we'll preserve it. Otherwise, we'll add our own blank indicator.
    if (question.prompt.includes('___') || question.prompt.includes('...')) {
      return question.prompt;
    } else {
      return question.prompt + ' _______';
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      onNext(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
          {formatPrompt()}
        </h3>
        
        <div className="mt-8">
          <div className={`
            relative border-2 rounded-xl overflow-hidden transition-all duration-300
            ${isFocused 
              ? 'border-blue-500 shadow-sm shadow-blue-100' 
              : 'border-gray-200 hover:border-gray-300'}
          `}>
            <motion.div
              initial={false}
              animate={{ 
                y: isFocused || input ? -30 : 0,
                scale: isFocused || input ? 0.85 : 1,
                color: isFocused ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)'
              }}
              className="absolute top-3 left-4 pointer-events-none"
            >
              <span className="text-gray-400 text-base font-medium">
                {question.blanks > 1 
                  ? `Wpisz ${question.blanks} odpowiedzi oddzielone przecinkami` 
                  : 'Wpisz odpowiedź'}
              </span>
            </motion.div>
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 pt-6 text-lg text-gray-800 bg-white outline-none"
              aria-label="Your answer"
            />
            
            <AnimatePresence>
              {input && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setInput('')}
                  className="absolute right-3 top-3 p-2 text-gray-400 hover:text-gray-600 rounded-full"
                  aria-label="Clear input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          {question.blanks > 1 && (
            <p className="mt-2 text-sm text-gray-500">
              Przykład: odpowiedź1, odpowiedź2, odpowiedź3
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!input.trim()}
          className={`
            px-8 py-3 rounded-xl font-medium transition-all duration-300
            ${input.trim() 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg shadow-blue-100' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          Submit Answer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FillBlanks;
