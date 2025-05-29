'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Quiz,
  QuizQuestion,
  MAMCQQuestion,
  SAMCQQuestion,
  FillBlanksQuestion,
  TrueFalseQuestion,
  MatchingQuestion
} from '../../../app/types/quiz';
import MAMCQ from '../../../app/courses/components/MAMCQ';
import FillBlanks from '../../../app/courses/components/FillBlanks';
import TrueFalse from '../../../app/courses/components/TrueFalse';
import SAMCQ from '../../../app/courses/components/SAMCQ';
import Matching from '../../../app/courses/components/Matching';

// Answers Modal Component
const AnswersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  userAnswers: (string[] | string | boolean | Record<number, string>)[];
}> = ({ isOpen, onClose, quiz, userAnswers }) => {
  if (!isOpen) return null;

  const getQuestionStatus = (question: QuizQuestion, index: number): 'correct' | 'incorrect' => {
    const answer = userAnswers[index];

    switch (question.type) {
      case 'MAMCQ': {
        const mamcqQuestion = question as MAMCQQuestion;
        const correct = [...mamcqQuestion.correctAnswers].sort();
        const userAnswer = Array.isArray(answer) ? [...answer].sort() : [];
        return JSON.stringify(correct) === JSON.stringify(userAnswer) ? 'correct' : 'incorrect';
      }
      case 'SAMCQ': {
        const samcqQuestion = question as SAMCQQuestion;
        return answer === samcqQuestion.correctAnswer ? 'correct' : 'incorrect';
      }
      case 'FillBlanks': {
        const fillBlanksQuestion = question as FillBlanksQuestion;
        return typeof answer === 'string' &&
          answer.trim().toLowerCase() === fillBlanksQuestion.answers[0].trim().toLowerCase()
          ? 'correct' : 'incorrect';
      }
      case 'TrueFalse': {
        const trueFalseQuestion = question as TrueFalseQuestion;
        return answer === trueFalseQuestion.correctAnswer ? 'correct' : 'incorrect';
      }
      case 'Matching': {
        const matchingQuestion = question as MatchingQuestion;
        let allCorrect = true;
        if (typeof answer === 'object' && !Array.isArray(answer) && answer !== null) {
          matchingQuestion.pairs.forEach((pair, idx) => {
            if (answer[idx] !== pair.definition) {
              allCorrect = false;
            }
          });
        } else {
          allCorrect = false;
        }
        return allCorrect ? 'correct' : 'incorrect';
      }
      default:
        return 'incorrect';
    }
  };

  const renderAnswersComparison = (question: QuizQuestion, index: number) => {
    const userAnswer = userAnswers[index];
    const status = getQuestionStatus(question, index);

    switch (question.type) {
      case 'MAMCQ': {
        const mamcqQuestion = question as MAMCQQuestion;
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [];
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Your Answer:</h5>
              <div className="space-y-2">
                {mamcqQuestion.options.map((option, idx) => {
                  const isUserSelected = userAnswerArray.includes(option);
                  const isCorrect = mamcqQuestion.correctAnswers.includes(option);
                  
                  let styling = 'bg-gray-50 border-gray-200 text-gray-600';
                  let icon = null;
                  
                  if (isUserSelected && isCorrect) {
                    styling = 'bg-green-50 border-green-200 text-green-800';
                    icon = <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
                  } else if (isUserSelected && !isCorrect) {
                    styling = 'bg-red-50 border-red-200 text-red-800';
                    icon = <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
                  } else if (!isUserSelected && isCorrect) {
                    styling = 'bg-orange-50 border-orange-200 text-orange-800';
                    icon = <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
                  }
                  
                  return (
                    <div key={idx} className={`p-3 rounded-lg border-2 ${styling}`}>
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-medium">{option}</span>
                        {isUserSelected && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            Selected
                          </span>
                        )}
                        {!isUserSelected && isCorrect && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            Missed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      case 'SAMCQ': {
        const samcqQuestion = question as SAMCQQuestion;
        const userSelectedOption = typeof userAnswer === 'string' ? userAnswer : '';
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Your Answer:</h5>
              <div className="space-y-2">
                {samcqQuestion.options.map((option, idx) => {
                  const isUserSelected = userSelectedOption === option;
                  const isCorrect = option === samcqQuestion.correctAnswer;
                  
                  let styling = 'bg-gray-50 border-gray-200 text-gray-600';
                  let icon = null;
                  
                  if (isCorrect) {
                    styling = 'bg-green-50 border-green-200 text-green-800';
                    icon = <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
                  } else if (isUserSelected) {
                    styling = 'bg-red-50 border-red-200 text-red-800';
                    icon = <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
                  }
                  
                  return (
                    <div key={idx} className={`p-3 rounded-lg border-2 ${styling}`}>
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-medium">{option}</span>
                        {isUserSelected && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            {isCorrect ? 'Correct' : 'Your Choice'}
                          </span>
                        )}
                        {!isUserSelected && isCorrect && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      case 'FillBlanks': {
        const fillBlanksQuestion = question as FillBlanksQuestion;
        const userText = typeof userAnswer === 'string' ? userAnswer : '';
        const correctAnswer = fillBlanksQuestion.answers[0];
        const isCorrect = userText.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h5>
              <div className={`p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`font-medium text-lg ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    "{userText || '(no answer provided)'}"
                  </span>
                </div>
              </div>
            </div>
            
            {!isCorrect && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</h5>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-lg">"{correctAnswer}"</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'TrueFalse': {
        const trueFalseQuestion = question as TrueFalseQuestion;
        const userBoolAnswer = typeof userAnswer === 'boolean' ? userAnswer : null;
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Your Answer:</h5>
              <div className="space-y-2">
                {[true, false].map((option) => {
                  const isUserSelected = userBoolAnswer === option;
                  const isCorrect = option === trueFalseQuestion.correctAnswer;
                  const label = option ? 'True' : 'False';
                  
                  let styling = 'bg-gray-50 border-gray-200 text-gray-600';
                  let icon = null;
                  
                  if (isCorrect) {
                    styling = 'bg-green-50 border-green-200 text-green-800';
                    icon = <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
                  } else if (isUserSelected) {
                    styling = 'bg-red-50 border-red-200 text-red-800';
                    icon = <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
                  }
                  
                  return (
                    <div key={label} className={`p-3 rounded-lg border-2 ${styling}`}>
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className="font-medium">{label}</span>
                        {isUserSelected && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            {isCorrect ? 'Correct' : 'Your Choice'}
                          </span>
                        )}
                        {!isUserSelected && isCorrect && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white bg-opacity-90 text-gray-700 font-medium border">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      case 'Matching': {
        const matchingQuestion = question as MatchingQuestion;
        const userMatchAnswer = typeof userAnswer === 'object' && !Array.isArray(userAnswer) && userAnswer !== null ? userAnswer : {};
        
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Your Matches vs Correct Answers:</h5>
              <div className="space-y-3">
                {matchingQuestion.pairs.map((pair, idx) => {
                  const userMatch = userMatchAnswer[idx];
                  const correctMatch = pair.definition;
                  const isCorrect = userMatch === correctMatch;
                  
                  return (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="font-medium text-gray-900 mb-2">{pair.term}</div>
                      
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg border-2 ${
                          isCorrect 
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            <div className="flex-1">
                              <div className="text-xs opacity-75 mb-1">Your answer:</div>
                              <div className="font-medium">{userMatch || '(no match selected)'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {!isCorrect && (
                          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-green-800">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <div className="flex-1">
                                <div className="text-xs opacity-75 mb-1">Correct answer:</div>
                                <div className="font-medium">{correctMatch}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      default:
        return <div>No answer comparison available</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quiz Answers</h2>
            <p className="text-gray-600 text-sm">Review all correct answers</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            {quiz.questions.map((question, index) => {
              const status = getQuestionStatus(question, index);
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6 bg-gray-50"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          status === 'correct'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status === 'correct' ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {status === 'correct' ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {question.type === 'MAMCQ'
                            ? 'Multiple Answers'
                            : question.type === 'SAMCQ'
                            ? 'Single Answer'
                            : question.type === 'TrueFalse'
                            ? 'True or False'
                            : question.type === 'FillBlanks'
                            ? 'Fill in the Blanks'
                            : question.type === 'Matching'
                            ? 'Matching'
                            : 'Quiz Question'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  {/* Answer Comparison */}
                  <div>
                    {renderAnswersComparison(question, index)}
                  </div>

                  {/* Explanation if available */}
                  {question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-sm text-blue-800">{question.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer - Hidden, only X button and outside click to close */}
      </motion.div>
    </motion.div>
  );
};

const CoursePage: React.FC = () => {
  // Retrieve the route parameter using useParams hook
  const { courseId } = useParams();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string[] | string | boolean | Record<number, string>)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswersModal, setShowAnswersModal] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes/${courseId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const data = await res.json();

        // If questions are stored as JSONB, parse them:
        const parsedQuiz: Quiz = {
          quizTitle: data.quiz_title,
          description: data.description,
          approximateTime: data.approximate_time,
          heroIconName: data.hero_icon_name,
          questions:
            typeof data.questions === 'string'
              ? JSON.parse(data.questions)
              : data.questions
        };

        setQuiz(parsedQuiz);
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchQuiz();
    }
  }, [courseId]);

  const handleNext = (answer: string[] | string | boolean | Record<number, string>) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = answer;
      return newAnswers;
    });

    if (currentIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = (): number => {
    if (!quiz) return 0;

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const answer = answers[index];

      switch (question.type) {
        case 'MAMCQ': {
          const mamcqQuestion = question as MAMCQQuestion;
          const correct = [...mamcqQuestion.correctAnswers].sort();
          const userAnswer = Array.isArray(answer) ? [...answer].sort() : [];
          if (JSON.stringify(correct) === JSON.stringify(userAnswer)) {
            score += 1;
          }
          break;
        }
        case 'SAMCQ': {
          const samcqQuestion = question as SAMCQQuestion;
          if (answer === samcqQuestion.correctAnswer) {
            score += 1;
          }
          break;
        }
        case 'FillBlanks': {
          const fillBlanksQuestion = question as FillBlanksQuestion;
          if (
            typeof answer === 'string' &&
            answer.trim().toLowerCase() === fillBlanksQuestion.answers[0].trim().toLowerCase()
          ) {
            score += 1;
          }
          break;
        }
        case 'TrueFalse': {
          const trueFalseQuestion = question as TrueFalseQuestion;
          if (answer === trueFalseQuestion.correctAnswer) {
            score += 1;
          }
          break;
        }
        case 'Matching': {
          const matchingQuestion = question as MatchingQuestion;
          let allCorrect = true;
          if (typeof answer === 'object' && !Array.isArray(answer) && answer !== null) {
            matchingQuestion.pairs.forEach((pair, idx) => {
              if (answer[idx] !== pair.definition) {
                allCorrect = false;
              }
            });
          } else {
            allCorrect = false;
          }
          if (allCorrect) {
            score += 1;
          }
          break;
        }
      }
    });

    return score;
  };

  const renderFeedback = (
    score: number,
    total: number
  ): { message: string; emoji: string; color: string } => {
    const percentage = (score / total) * 100;

    if (percentage === 100) {
      return {
        message: "Perfect! You've mastered this material!",
        emoji: "🏆",
        color: "text-emerald-600"
      };
    } else if (percentage >= 80) {
      return {
        message: "Excellent work! You have a strong understanding of the concepts.",
        emoji: "🌟",
        color: "text-green-600"
      };
    } else if (percentage >= 60) {
      return {
        message: "Good job! You're on the right track with most concepts.",
        emoji: "👍",
        color: "text-blue-600"
      };
    } else if (percentage >= 40) {
      return {
        message: "Not bad. With a bit more practice, you'll improve your understanding.",
        emoji: "🔍",
        color: "text-amber-600"
      };
    } else {
      return {
        message: "Keep studying! These concepts take time to master.",
        emoji: "📚",
        color: "text-purple-600"
      };
    }
  };

  const renderQuestion = (question: QuizQuestion): React.ReactNode => {
    switch (question.type) {
      case 'MAMCQ':
        return <MAMCQ key={question.id} question={question as MAMCQQuestion} onNext={(answer: string[]) => handleNext(answer)} />;
      case 'FillBlanks':
        return <FillBlanks key={question.id} question={question as FillBlanksQuestion} onNext={(answer: string) => handleNext(answer)} />;
      case 'TrueFalse':
        return <TrueFalse key={question.id} question={question as TrueFalseQuestion} onNext={(answer: boolean) => handleNext(answer)} />;
      case 'SAMCQ':
        return <SAMCQ key={question.id} question={question as SAMCQQuestion} onNext={(answer: string) => handleNext(answer)} />;
      case 'Matching':
        return <Matching key={question.id} question={question as MatchingQuestion} onNext={(answer: Record<number, string>) => handleNext(answer)} />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading quiz...</p>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="bg-red-100 p-6 rounded-lg max-w-md">
          <svg className="w-16 h-16 text-red-500 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Not Available</h3>
          <p className="text-gray-600">{error || "We couldn't load the quiz. Please try refreshing the page."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate quiz score and feedback
  const totalScore = calculateScore();
  const totalQuestions = quiz.questions.length;
  const scorePercentage = (totalScore / totalQuestions) * 100;
  const feedback = renderFeedback(totalScore, totalQuestions);
  const currentQuestion = !isFinished ? quiz.questions[currentIndex] : null;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{quiz.quizTitle}</h1>
        </div>

        <AnimatePresence mode="wait">
          {!isFinished && currentQuestion ? (
            <motion.div 
              key="quiz-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 md:p-8"
            >
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentIndex + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${(currentIndex / quiz.questions.length) * 100}%` }}
                    animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  ></motion.div>
                </div>
              </div>

              {/* Question Type Label */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium uppercase tracking-wide">
                  {currentQuestion.type === 'MAMCQ'
                    ? 'Multiple Answers'
                    : currentQuestion.type === 'SAMCQ'
                    ? 'Single Answer'
                    : currentQuestion.type === 'TrueFalse'
                    ? 'True or False'
                    : currentQuestion.type === 'FillBlanks'
                    ? 'Fill in the Blanks'
                    : currentQuestion.type === 'Matching'
                    ? 'Matching'
                    : 'Quiz Question'}
                </span>
              </div>

              {/* Render current question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`question-${currentIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {renderQuestion(currentQuestion)}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="py-8 px-8 md:px-10 text-center">
                <span className="text-5xl mb-4 block">{feedback.emoji}</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
                <div className="my-8 flex justify-center">
                  <div className="relative w-40 h-40">
                    {/* Circular progress bar */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-gray-100" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <circle 
                        className="text-blue-600" 
                        strokeWidth="10" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (scorePercentage / 100 * 251.2)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">
                          {totalScore}/{totalQuestions}
                        </div>
                        <div className="text-sm text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className={`text-xl ${feedback.color} font-medium mb-6`}>{feedback.message}</p>
                <div className="bg-gray-50 p-5 rounded-xl mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-gray-500 text-sm">Correct</div>
                      <div className="text-green-600 font-bold text-xl">{totalScore}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-gray-500 text-sm">Incorrect</div>
                      <div className="text-red-600 font-bold text-xl">{totalQuestions - totalScore}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <button 
                    onClick={() => setShowAnswersModal(true)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Answers
                  </button>
                  <button 
                    onClick={() => {
                      setAnswers([]);
                      setCurrentIndex(0);
                      setIsFinished(false);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Retry Quiz
                  </button>
                  <button 
                    onClick={() => (window.location.href = `/courses`)}
                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Back to Courses
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Jan Mańczak. All rights reserved.</p>
        </div>
      </motion.div>

      {/* Answers Modal */}
      <AnimatePresence>
        {showAnswersModal && quiz && (
          <AnswersModal
            isOpen={showAnswersModal}
            onClose={() => setShowAnswersModal(false)}
            quiz={quiz}
            userAnswers={answers}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;