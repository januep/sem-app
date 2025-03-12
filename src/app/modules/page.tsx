'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'

// This would typically come from your API or database
const quizData = {
  id: 'office-safety-quiz',
  title: 'Office Health & Safety Quiz',
  description: 'Test your knowledge of common workplace safety procedures and best practices.',
  questions: [
    {
      id: 'q1',
      text: 'What should you do if you notice a frayed electrical cord in the office?',
      options: [
        'Tape it up with electrical tape',
        'Unplug it and report it to facilities management',
        'Continue using it but be careful',
        'Cover it with a carpet or rug'
      ],
      correctAnswer: 1
    },
    {
      id: 'q2',
      text: 'How often should you take breaks from prolonged computer work to prevent eye strain?',
      options: [
        'Every 4 hours',
        'Once a day',
        'Every 20-30 minutes',
        'Only when your eyes feel tired'
      ],
      correctAnswer: 2
    },
    {
      id: 'q3',
      text: 'What is the proper posture for sitting at a desk?',
      options: [
        'Leaning forward with your back straight',
        'Leaning back with your feet up on the desk',
        'Sitting with your back against the chair, feet flat on the floor, and eyes level with the top of the monitor',
        'Sitting cross-legged on your chair'
      ],
      correctAnswer: 2
    },
    {
      id: 'q4',
      text: 'In case of a fire emergency, you should:',
      options: [
        'Gather your personal belongings before evacuating',
        'Use the elevator to exit the building quickly',
        'Follow the evacuation plan and use designated exit routes',
        'Hide under your desk until help arrives'
      ],
      correctAnswer: 2
    },
    {
      id: 'q5',
      text: 'Which of the following is NOT a recommended practice for preventing musculoskeletal disorders?',
      options: [
        'Maintaining the same position for long periods to build endurance',
        'Using adjustable chairs and desks',
        'Taking regular breaks to stretch',
        'Using ergonomic keyboards and mice'
      ],
      correctAnswer: 0
    }
  ]
}

export default function QuizModule({ }: { params: { moduleId: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(quizData.questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      const newAnswers = [...selectedAnswers]
      newAnswers[currentQuestion] = answerIndex
      setSelectedAnswers(newAnswers)
    }
  }

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setIsAnswerSubmitted(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(Array(quizData.questions.length).fill(-1))
    setShowResults(false)
    setIsAnswerSubmitted(false)
  }

  const handleBackToModules = () => {
    router.push('/modules')
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === quizData.questions[index].correctAnswer ? score + 1 : score
    }, 0)
  }

  const score = calculateScore()
  const scorePercentage = Math.round((score / quizData.questions.length) * 100)

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl w-full mx-auto px-6 py-16">
          {!showResults ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{quizData.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{quizData.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Question {currentQuestion + 1} of {quizData.questions.length}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {quizData.questions[currentQuestion].text}
                  </h2>

                  <div className="space-y-3">
                    {quizData.questions[currentQuestion].options.map((option, index) => (
                      <div 
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-all
                          ${selectedAnswers[currentQuestion] === index ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}
                          ${isAnswerSubmitted && index === quizData.questions[currentQuestion].correctAnswer ? 'border-green-600 bg-green-50' : ''}
                          ${isAnswerSubmitted && selectedAnswers[currentQuestion] === index && index !== quizData.questions[currentQuestion].correctAnswer ? 'border-red-600 bg-red-50' : ''}
                        `}
                      >
                        <div className="flex items-center">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center mr-3
                            ${selectedAnswers[currentQuestion] === index ? 'bg-indigo-600 text-white' : 'bg-gray-200'}
                            ${isAnswerSubmitted && index === quizData.questions[currentQuestion].correctAnswer ? 'bg-green-600 text-white' : ''}
                            ${isAnswerSubmitted && selectedAnswers[currentQuestion] === index && index !== quizData.questions[currentQuestion].correctAnswer ? 'bg-red-600 text-white' : ''}
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-800">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isAnswerSubmitted && (
                    <div className={`mt-6 p-4 rounded-lg ${selectedAnswers[currentQuestion] === quizData.questions[currentQuestion].correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <h3 className={`font-semibold ${selectedAnswers[currentQuestion] === quizData.questions[currentQuestion].correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                        {selectedAnswers[currentQuestion] === quizData.questions[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect!'}
                      </h3>
                      <p className="mt-1 text-gray-700">
                        The correct answer is: {quizData.questions[currentQuestion].options[quizData.questions[currentQuestion].correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 flex justify-between">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswers[currentQuestion] === -1}
                      className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        selectedAnswers[currentQuestion] !== -1
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Check Answer                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      {currentQuestion < quizData.questions.length - 1 ? "Next Question" : "See Results"}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Quiz Results</h2>
              <p className="text-lg text-gray-600 mt-4">You scored {score} out of {quizData.questions.length}.</p>
              <p className="text-lg font-semibold mt-2">
                Score: <span className={`${scorePercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>{scorePercentage}%</span>
              </p>

              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="px-6 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={handleBackToModules}
                  className="px-6 py-2 rounded-full font-medium bg-gray-400 text-white hover:bg-gray-500 transition-colors"
                >
                  Back to Modules
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
