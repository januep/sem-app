'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChooseDataset() {
  const router = useRouter()
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleOptionSelect = (option: string) => {
    // Navigate to the next page based on selection
    if (option === 'existing') {
      router.push('/datasets/existing')
    } else if (option === 'upload') {
      router.push('/datasets/upload')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop here
    // For now, just navigate to the upload page
    router.push('/datasets/upload')
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md" />
            <span className="font-bold text-xl text-gray-800">LearnAI</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Home</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Datasets</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Modules</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition">About</a>
          </nav>
          <button className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition">
            <span className="hidden md:inline">Account</span>
            <span className="md:hidden">👤</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Choose Your Dataset</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select an existing dataset or upload your own PDF documents to create interactive learning modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Existing Dataset Option */}
          <div 
            className={`
              bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
              transform hover:-translate-y-1 overflow-hidden
              ${hoveredOption === 'existing' ? 'ring-2 ring-indigo-400' : ''}
            `}
            onMouseEnter={() => setHoveredOption('existing')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('existing')}
          >
            <div className="h-48 bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Use Existing Dataset</h3>
              <p className="text-gray-600 mb-4">
                Choose from our library of pre-processed educational materials ready for interactive learning.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">20+ datasets available</span>
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Upload PDF Option */}
          <div 
            className={`
              bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
              transform hover:-translate-y-1 overflow-hidden
              ${hoveredOption === 'upload' ? 'ring-2 ring-indigo-400' : ''}
              ${isDragging ? 'ring-2 ring-indigo-600 bg-indigo-50' : ''}
            `}
            onMouseEnter={() => setHoveredOption('upload')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('upload')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload PDF Document</h3>
              <p className="text-gray-600 mb-4">
                Transform your own training materials into interactive learning modules with AI.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Drag & drop or browse</span>
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-indigo-600">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Select or Upload</h4>
              <p className="text-gray-600">Choose an existing dataset or upload your own PDF documents.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-indigo-600">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">AI Processing</h4>
              <p className="text-gray-600">Our AI analyzes and transforms content into interactive learning materials.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-indigo-600">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Learn & Engage</h4>
              <p className="text-gray-600">Start learning with flashcards, quizzes, games, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}