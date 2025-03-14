'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

// Define available quizzes
const quizzes: Record<string, Quiz> = {
  'office-safety': {
    title: 'Office Health & Safety Quiz',
    description: 'Test your knowledge of workplace safety procedures and best practices.',
    questions: [
      {
        id: 'q1',
        text: 'What should you do if you notice a frayed electrical cord in the office?',
        options: [
          'Tape it up with electrical tape',
          'Unplug it and report it to facilities management',
          'Continue using it but be careful',
          'Cover it with a carpet or rug',
        ],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        text: 'How often should you take breaks from prolonged computer work to prevent eye strain?',
        options: ['Every 4 hours', 'Once a day', 'Every 20-30 minutes', 'Only when your eyes feel tired'],
        correctAnswer: 2,
      },
    ],
  },
};

export default function QuizModule() {
  const params = useParams<{ moduleId: string }>();
  const router = useRouter();
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  // Load quiz data when params are available
  useEffect(() => {
    if (params?.moduleId && quizzes[params.moduleId]) {
      setQuizData(quizzes[params.moduleId]);
      setSelectedAnswers(new Array(quizzes[params.moduleId].questions.length).fill(-1));
    }
  }, [params?.moduleId]);

  // If quiz data is not found, show error message
  if (!quizData) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Quiz Not Found</h1>
          <p className="text-gray-600 mb-6">We couldnt find the quiz youre looking for. Please select a valid quiz.</p>
          <button
            onClick={() => router.push('/modules')}
            className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Modules
          </button>
        </div>
      </main>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
    setFeedbackVisible(true);
  };

  const handleNextQuestion = () => {
    setFeedbackVisible(false);
    
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswerSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizData.questions.length).fill(-1));
    setShowResults(false);
    setIsAnswerSubmitted(false);
    setFeedbackVisible(false);
  };

  const calculateScore = () => {
    return selectedAnswers.filter((ans, i) => ans === quizData.questions[i].correctAnswer).length;
  };

  const getScorePercentage = () => {
    return (calculateScore() / quizData.questions.length) * 100;
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCurrentQuestionFeedback = () => {
    const isCorrect = selectedAnswers[currentQuestion] === quizData.questions[currentQuestion].correctAnswer;
    return isCorrect ? (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Correct!</span>
        </div>
      </div>
    ) : (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium">Incorrect. The correct answer is: {quizData.questions[currentQuestion].options[quizData.questions[currentQuestion].correctAnswer]}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl w-full mx-auto px-6 py-16">
          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4 text-white">
                <h1 className="text-2xl font-bold">{quizData.title}</h1>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-indigo-100">{quizData.description}</p>
                  <div className="bg-white text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentQuestion + 1} of {quizData.questions.length}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-indigo-400 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300" 
                    style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{quizData.questions[currentQuestion].text}</h2>
                <div className="space-y-3">
                  {quizData.questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index;
                    const isCorrectAnswer = isAnswerSubmitted && index === quizData.questions[currentQuestion].correctAnswer;
                    const isWrongSelection = isAnswerSubmitted && isSelected && !isCorrectAnswer;
                    
                    let optionClass = "p-4 border rounded-xl transition duration-200 ";
                    
                    if (isAnswerSubmitted) {
                      if (isCorrectAnswer) {
                        optionClass += "border-green-500 bg-green-50 ";
                      } else if (isWrongSelection) {
                        optionClass += "border-red-500 bg-red-50 ";
                      } else {
                        optionClass += "border-gray-200 ";
                      }
                    } else {
                      optionClass += isSelected 
                        ? "border-indigo-500 bg-indigo-50 "
                        : "border-gray-200 hover:bg-gray-50 ";
                    }
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={optionClass + (isAnswerSubmitted ? "cursor-default" : "cursor-pointer")}
                      >
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-6 h-6 mr-3 rounded-full ${
                            isSelected ? 'bg-indigo-500' : 'border-2 border-gray-300'
                          } flex items-center justify-center`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {feedbackVisible && isAnswerSubmitted && getCurrentQuestionFeedback()}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={isAnswerSubmitted ? handleNextQuestion : handleSubmitAnswer}
                    disabled={selectedAnswers[currentQuestion] === -1}
                    className={`
                      px-6 py-3 rounded-xl text-white font-medium transition duration-300
                      ${selectedAnswers[currentQuestion] === -1 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}
                    `}
                  >
                    {isAnswerSubmitted ? (currentQuestion < quizData.questions.length - 1 ? 'Next Question' : 'See Results') : 'Submit Answer'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
              <div className="bg-indigo-600 px-6 py-10 text-white">
                <div className="w-24 h-24 rounded-full bg-white mx-auto flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor()}`}>{getScorePercentage().toFixed(0)}%</span>
                </div>
                <h2 className="text-3xl font-bold mt-4">Quiz Completed!</h2>
                <p className="text-indigo-100 mt-2">
                  You scored {calculateScore()} out of {quizData.questions.length} questions correctly.
                </p>
              </div>
              
              <div className="p-8">
                <div className="mb-8">
                  {getScorePercentage() >= 80 ? (
                    <div className="text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">Great job! Youve mastered this quiz.</p>
                    </div>
                  ) : getScorePercentage() >= 60 ? (
                    <div className="text-yellow-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-lg font-medium">Good effort! You might want to review some topics.</p>
                    </div>
                  ) : (
                    <div className="text-red-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">You need more practice with this material.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleRetakeQuiz} 
                    className="py-3 px-6 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Retake Quiz
                  </button>
                  <button 
                    onClick={() => router.push('/modules')} 
                    className="py-3 px-6 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Back to Modules
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}