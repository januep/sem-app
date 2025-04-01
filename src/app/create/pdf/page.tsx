'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CreateQuizFromPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!pdfFile) {
      setStatus({
        type: 'error',
        message: 'Please upload a PDF file to generate a quiz.',
      });
      return;
    }

    setIsGenerating(true);
    setStatus({
      type: 'info',
      message: 'Generating your quiz from PDF... This may take a few moments.',
    });

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      // Upewnij się, że wysyłasz żądanie do poprawnego endpointu
      const response = await fetch('/api/quiz/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz from PDF');
      }

      const data = await response.json();

      setStatus({
        type: 'success',
        message: `Quiz "${data.quizTitle}" was successfully generated and saved!`,
      });

      // Opcjonalnie przekieruj użytkownika do strony z quizem po krótkim czasie
      setTimeout(() => {
        router.push(`/courses/${data.id}`);
      }, 3000);
    } catch (error) {
      console.error('Error generating quiz from PDF:', error);
      setStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Create a Quiz from PDF
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Upload a PDF document and our AI will generate a quiz for you.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-2">
              PDF Document
            </label>
            <div className="relative">
              <input
                type="file"
                id="pdf"
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setPdfFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-gray-900 border border-gray-300 rounded-md py-3 px-4 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isGenerating}
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Please select a PDF file containing the content for the quiz.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isGenerating || !pdfFile}
              className={`
                flex items-center justify-center rounded-md px-5 py-3 text-base font-medium text-white
                transition duration-150 ease-in-out
                ${isGenerating || !pdfFile 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}
              `}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </div>
        </form>
      </div>

      {status.type && (
        <div
          className={`mt-6 rounded-md p-4 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {status.type === 'success' && (
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {status.type === 'error' && (
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {status.type === 'info' && (
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
