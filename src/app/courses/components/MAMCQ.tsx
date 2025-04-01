import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAMCQQuestion } from '../../types/quiz';

interface MAMCQProps {
  question: MAMCQQuestion;
  onNext: (answer: string[]) => void;
}

const MAMCQ: React.FC<MAMCQProps> = ({ question, onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  // Shuffle options if needed (comment out if you want to preserve order)
  // const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-3">
          {question.prompt}
        </h3>
        
        <p className="text-sm text-blue-600 font-medium mb-5">
          Select all correct answers
        </p>

        <div className="space-y-3 mt-6">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                onClick={() => toggleOption(option)}
                className={`
                  relative flex items-center p-4 md:p-5 rounded-xl border-2 transition-all duration-200
                  cursor-pointer select-none hover:border-blue-200 hover:bg-blue-50
                  ${selected.includes(option) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-100 bg-white'}
                `}
              >
                <div className={`
                  w-6 h-6 mr-4 rounded flex items-center justify-center border-2 transition-all duration-200
                  ${selected.includes(option) 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'}
                `}>
                  <AnimatePresence>
                    {selected.includes(option) && (
                      <motion.svg 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
                
                <span className={`
                  text-base md:text-lg transition-colors duration-200
                  ${selected.includes(option) ? 'text-gray-800 font-medium' : 'text-gray-600'}
                `}>
                  {option}
                </span>

                {/* Option index indicator */}
                <div className="absolute top-2 right-3 text-xs font-mono text-gray-400">
                  {String.fromCharCode(65 + index)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional info below options */}
      <div className="mt-3 mb-6">
        <p className="text-sm text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          You have selected {selected.length} option{selected.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNext(selected)}
          className={`
            px-8 py-3 rounded-xl font-medium transition-all duration-300
            ${selected.length > 0 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg shadow-blue-100' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
          disabled={selected.length === 0}
        >
          Submit {selected.length > 0 ? `(${selected.length})` : ''}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MAMCQ;
