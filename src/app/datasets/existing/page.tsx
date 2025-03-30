'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ExistingDatasets() {
  const router = useRouter()
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset(datasetId)
  }

  const handleContinue = () => {
    if (selectedDataset) {
      router.push(`/modules/${selectedDataset}`)
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl w-full mx-auto px-6 py-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Example Datasets</h1>
            <p className="text-lg text-gray-600">
              Select one of our pre-processed datasets to explore interactive learning modules.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div 
              className={`p-6 cursor-pointer transition-colors border-l-4 ${
                selectedDataset === 'office-safety' 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => handleDatasetSelect('office-safety')}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Office Health & Safety</h3>
                  <p className="text-gray-600 mb-3">
                    Comprehensive guide to workplace safety protocols, ergonomics, emergency procedures, and health best practices.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Safety</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Ergonomics</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Emergency</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Health</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 flex items-center">
                  <input 
                    type="radio" 
                    checked={selectedDataset === 'office-safety'}
                    onChange={() => handleDatasetSelect('office-safety')}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              {selectedDataset === 'office-safety' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Dataset Size:</span>
                    <span className="text-gray-800 font-medium">24 pages</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Learning Modules:</span>
                    <span className="text-gray-800 font-medium">5 modules</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-500">Learning Activities:</span>
                    <span className="text-gray-800 font-medium">15 activities (quizzes, flashcards, games)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated Completion Time:</span>
                    <span className="text-gray-800 font-medium">45 minutes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedDataset}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                selectedDataset
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Modules
            </button>
          </div>
        </div>
      </main>
    </>
  )
}