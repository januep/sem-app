import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMCQQuestion } from '../../types/quiz';

interface SAMCQProps {
  question: SAMCQQuestion;
  onNext: (answer: string) => void;
}

const SAMCQ: React.FC<SAMCQProps> = ({ question, onNext }) => {
  const [selected, setSelected] = useState<string>('');
  const [isHovering, setIsHovering] = useState<number | null>(null);

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
        
        <p className="text-sm text-indigo-600 font-medium mb-5">
          Select the correct answer
        </p>

        <div className="space-y-3 mt-6">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setIsHovering(index)}
              onHoverEnd={() => setIsHovering(null)}
            >
              <div 
                onClick={() => setSelected(option)}
                className={`
                  relative flex items-center p-4 md:p-5 rounded-xl transition-all duration-200
                  cursor-pointer select-none border-2
                  ${selected === option 
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                    : isHovering === index 
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50'}
                `}
                aria-checked={selected === option}
                role="radio"
              >
                <div className={`
                  w-6 h-6 mr-4 rounded-full flex items-center justify-center border-2 transition-all duration-200
                  ${selected === option 
                    ? 'border-indigo-500' 
                    : 'border-gray-300'}
                `}>
                  <AnimatePresence>
                    {selected === option && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="w-3 h-3 bg-indigo-500 rounded-full" 
                      />
                    )}
                  </AnimatePresence>
                </div>
                
                <span className={`
                  text-base md:text-lg transition-colors duration-200
                  ${selected === option ? 'text-gray-800 font-medium' : 'text-gray-600'}
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

      <div className="flex justify-between items-center mt-8">
        {/* Selection indicator */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center text-indigo-600 text-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Option selected
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className={`
            px-8 py-3 rounded-xl font-medium transition-all duration-300
            ${selected 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg shadow-indigo-100' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          Submit Answer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SAMCQ;
