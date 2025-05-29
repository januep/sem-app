'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FiDatabase, 
  FiUpload, 
  FiEdit, 
  FiArrowRight, 
  FiFolder, 
  FiCpu, 
  FiBookOpen 
} from 'react-icons/fi'

export default function ChooseDataset() {
  const router = useRouter()
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleOptionSelect = (option: string) => {
    if (option === 'existing') {
      router.push('/create/upload')
    } else if (option === 'upload') {
      router.push('/create/pdf')
    } else if (option === 'prompt') {
      router.push('/create/prompt')
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
    router.push('/datasets/upload')
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Twórz kursy w mgnieniu oka
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wybierz sposób, w jaki chcesz utworzyć nowy kurs.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Existing Dataset Option */}
          <div 
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden ${
              hoveredOption === 'existing' ? 'ring-2 ring-indigo-400' : ''
            }`}
            onMouseEnter={() => setHoveredOption('existing')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('existing')}
          >
            <div className="h-48 flex items-center justify-center bg-indigo-50">
              <FiDatabase className="text-6xl text-indigo-600" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Utworz potężny kurs, który zniszczy każdego.
              </h3>
              <p className="text-gray-600 mb-4">
                Wybierz spośród naszej biblioteki wstępnie przetworzonych materiałów edukacyjnych przygotowanych do interaktywnej nauki.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Ponad 20 zbiorów danych dostępnych
                </span>
                <FiArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Upload PDF Option */}
          <div 
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden ${
              hoveredOption === 'upload' ? 'ring-2 ring-indigo-400' : ''
            } ${isDragging ? 'ring-2 ring-indigo-600 bg-indigo-50' : ''}`}
            onMouseEnter={() => setHoveredOption('upload')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('upload')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="h-48 flex items-center justify-center bg-indigo-50">
              <FiUpload className="text-6xl text-indigo-600" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Prześlij dokument PDF
              </h3>
              <p className="text-gray-600 mb-4">
                Przekształć swoje materiały szkoleniowe w interaktywne moduły nauki dzięki AI.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Przeciągnij i upuść lub przeglądaj
                </span>
                <FiArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Create Using Prompt Option */}
          <div 
            className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden ${
              hoveredOption === 'prompt' ? 'ring-2 ring-indigo-400' : ''
            }`}
            onMouseEnter={() => setHoveredOption('prompt')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('prompt')}
          >
            <div className="h-48 flex items-center justify-center bg-indigo-50">
              <FiEdit className="text-6xl text-indigo-600" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Utwórz przy użyciu podpowiedzi
              </h3>
              <p className="text-gray-600 mb-4">
                Wygeneruj kurs, korzystając z interaktywnej podpowiedzi, która poprowadzi Twój kreatywny proces.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Zacznij od podstaw
                </span>
                <FiArrowRight className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Jak to działa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <FiFolder className="text-3xl text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Wybierz lub Prześlij
              </h4>
              <p className="text-gray-600">
                Wybierz istniejący zbiór danych lub prześlij swoje własne dokumenty PDF.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <FiCpu className="text-3xl text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Przetwarzanie AI
              </h4>
              <p className="text-gray-600">
                Nasza AI analizuje i przekształca treści w interaktywne materiały edukacyjne.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <FiBookOpen className="text-3xl text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Ucz się i angażuj
              </h4>
              <p className="text-gray-600">
                Rozpocznij naukę z fiszkami, quizami, grami i nie tylko.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
