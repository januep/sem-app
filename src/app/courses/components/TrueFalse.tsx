import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrueFalseQuestion } from '../../types/quiz';

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onNext: (answer: boolean) => void;
}

const TrueFalse: React.FC<TrueFalseProps> = ({ question, onNext }) => {
  const [selected, setSelected] = useState<boolean | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl font-medium text-gray-800 mb-4"
      >
        {question.prompt}
      </motion.h2>
      
      <p className="text-sm text-indigo-600 font-medium mb-5">
        Indicate whether this statement is true or false
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[true, false].map((value) => (
          <motion.button
            key={value.toString()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(value)}
            className={`
              p-6 rounded-xl transition-all duration-200 flex justify-center items-center font-medium text-lg
              ${selected === value 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border-2 border-indigo-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'}
            `}
          >
            <motion.div
              animate={{ scale: selected === value ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              {/* Icon for true/false */}
              {value ? (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{value ? 'Prawda' : 'Fałsz'}</span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <motion.div 
        className="mt-10 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: selected !== null ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => selected !== null && onNext(selected)}
          disabled={selected === null}
          className={`
            px-8 py-3 rounded-xl font-medium text-white 
            ${selected !== null 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg shadow-indigo-100' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            transition-all duration-300
          `}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TrueFalse;
