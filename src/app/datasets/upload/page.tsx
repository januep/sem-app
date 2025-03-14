'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';


export default function UploadDataset() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // TODO: Implement API call to upload the file
      console.log(`Uploading file: ${selectedFile.name}`);
      router.push('/datasets'); // Redirect after upload
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-2xl w-full mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Upload Your PDF</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your training materials, and well transform them into interactive learning experiences.
          </p>

          <div
            className={`border-2 border-dashed rounded-lg p-8 bg-white shadow-md cursor-pointer transition-all 
            ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" accept="application/pdf" className="hidden" id="file-upload" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
              <svg className="w-12 h-12 text-indigo-600 mb-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-700">{selectedFile ? selectedFile.name : 'Drag & drop or click to upload a PDF'}</p>
            </label>
          </div>

          {selectedFile && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-800 font-semibold">Selected File:</p>
              <p className="text-gray-600">{selectedFile.name}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`mt-6 px-6 py-2 rounded-full font-medium transition-colors ${
              selectedFile ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Upload & Process
          </button>

          <button
            onClick={() => router.push('/datasets')}
            className="mt-4 px-6 py-2 rounded-full font-medium bg-gray-400 text-white hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </main>
    </>
  );
}
