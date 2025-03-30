'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function CreateCoursePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [completion, setCompletion] = useState<string>('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'text/plain') {
      setProcessingStatus('Please upload a plain text (.txt) file');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setProcessingStatus('Processing text file with GPT‑3.5...');

    try {
      // 1) Prepare FormData with the .txt file
      const formData = new FormData();
      formData.append('text', file);

      // 2) Call our API route
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to process text file');
      }

      // 3) Parse the JSON response (with completion from GPT‑3.5)
      const data = await response.json();
      console.log('GPT‑3.5 Completion:', data.completion);

      setCompletion(data.completion);
      setProcessingStatus('Success! GPT‑3.5 completion received.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        setProcessingStatus(`Error: ${error.message}`);
      } else {
        console.error('Error:', error);
        setProcessingStatus('Error: Unknown error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // react-dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'] },
    disabled: isProcessing,
    maxFiles: 1,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create a New Course (GPT‑3.5)</h1>
      <p className="text-gray-600 mb-8">
        Upload a text file. The file contents will be sent as a prompt to GPT‑3.5, 
        and the response can help you build your course materials.
      </p>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Processing {fileName}...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              {isDragActive ? (
                <p className="text-lg text-blue-500 font-medium">Drop the text file here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag & drop a text file here, or click to select</p>
                  <p className="text-sm text-gray-500 mt-2">Only plain text (.txt) files are accepted</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {processingStatus && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            processingStatus.startsWith('Error')
              ? 'bg-red-50 text-red-600'
              : 'bg-green-50 text-green-600'
          }`}
        >
          {processingStatus}
        </div>
      )}

      {completion && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">GPT‑3.5 Response</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{completion}</p>
        </div>
      )}

      {fileName && !isProcessing && (
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => console.log('Continuing to next step with GPT response...')}
          >
            Continue to Course Creation
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Note: This button just logs a message for now. You could store the GPT response in a database or route it elsewhere.
          </p>
        </div>
      )}
    </div>
  );
}
