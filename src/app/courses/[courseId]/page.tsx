'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz, QuizQuestion, MAMCQQuestion, SAMCQQuestion, FillBlanksQuestion, TrueFalseQuestion, MatchingQuestion } from '../../../app/types/quiz';
import MAMCQ from '../../../app/courses/components/MAMCQ';
import FillBlanks from '../../../app/courses/components/FillBlanks';
import TrueFalse from '../../../app/courses/components/TrueFalse';
import SAMCQ from '../../../app/courses/components/SAMCQ';
import Matching from '../../../app/courses/components/Matching';

interface PageProps {
  params: {
    courseId: string;
  };
}

type AnswerType = string[] | string | boolean | Record<number, string>;

const CoursePage: React.FC<PageProps> = ({ params }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes/${params.courseId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const data = await res.json();
        
        // 🧠 Jeśli pytania są w JSONB, musisz je sparsować:
        const parsedQuiz: Quiz = {
          quizTitle: data.quiz_title,
          description: data.description,
          approximateTime: data.approximate_time,
          heroIconName: data.hero_icon_name,
          questions: typeof data.questions === 'string' 
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
    

    fetchQuiz();
  }, [params.courseId]);

  const handleNext = (answer: AnswerType) => {
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

  const renderFeedback = (score: number, total: number): {
    message: string;
    emoji: string;
    color: string;
  } => {
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
          <svg className="w-16 h-16 text-red-500 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Not Available</h3>
          <p className="text-gray-600">{error || "We couldn't load the quiz. Please try refreshing the page."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate the values once
  const totalScore = calculateScore();
  const totalQuestions = quiz.questions.length;
  const scorePercentage = (totalScore / totalQuestions) * 100;
  const feedback = renderFeedback(totalScore, totalQuestions);
  
  // Get current question if we're not finished
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
          {/* If you have a description in your Quiz type, you can add it here */}
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
                    {Math.round((currentIndex + 1) / quiz.questions.length * 100)}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: `${((currentIndex) / quiz.questions.length) * 100}%` }}
                    animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  ></motion.div>
                </div>
              </div>
              
              {/* Question Type Label */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium uppercase tracking-wide">
                  {currentQuestion.type === 'MAMCQ' ? 'Multiple Answers' :
                   currentQuestion.type === 'SAMCQ' ? 'Single Answer' :
                   currentQuestion.type === 'TrueFalse' ? 'True or False' :
                   currentQuestion.type === 'FillBlanks' ? 'Fill in the Blanks' :
                   currentQuestion.type === 'Matching' ? 'Matching' : 'Quiz Question'}
                </span>
              </div>
              
              {/* Current Question */}
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
                        <div className="text-3xl font-bold text-gray-800">{totalScore}/{totalQuestions}</div>
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
                    onClick={() => {
                      setAnswers([]);
                      setCurrentIndex(0);
                      setIsFinished(false);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    Retry Quiz
                  </button>
                  <button 
                    onClick={() => window.location.href = `/courses`}
                    className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors"
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
    </div>
  );
};

export default CoursePage;
