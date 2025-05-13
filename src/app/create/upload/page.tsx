// src/app/create/upload/page.tsx
'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PDFMetadata {
  filename: string;
  fileSize: number;
  pageCount: number;
  title: string | null;
  author: string | null;
  subject: string | null;
  wordCount: number;
  characterCount: number;
  creationDate: string | null;
  modificationDate: string | null;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCloudUploading, setIsCloudUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
    setMetadata(null);
    setDocumentId(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please drop a PDF file');
      return;
    }
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      setMetadata(null);
      setDocumentId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setMetadata(null);
    setDocumentId(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-check', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload PDF');
      }
      const data = await response.json();
      setMetadata(data.metadata);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadToCloud = async () => {
    if (!file) return;

    setIsCloudUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload to cloud');
      }

      // read both document_id and metadata
      const data = (await response.json()) as {
        document_id: string;
        metadata: PDFMetadata;
      };

      setDocumentId(data.document_id);
      setMetadata(data.metadata);

      router.push(`/pdf/${data.document_id}`);
    } catch (err) {
      console.error('Cloud upload error:', err);
      setError(err instanceof Error ? err.message : 'Cloud upload failed');
    } finally {
      setIsCloudUploading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const buttonVariants = { idle: { scale: 1 }, hover: { scale: 1.05 }, tap: { scale: 0.95 } };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-gray-800 mb-2">
            PDF Metadata Extractor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-gray-600 mb-8"
          >
            Upload your PDF to analyze and extract its metadata
          </motion.p>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="text-center">
                  <motion.div animate={{ scale: dragActive ? 1.1 : 1 }} className="mx-auto h-16 w-16 mb-4 text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </motion.div>
                  <p className="text-gray-700 font-medium mb-1">
                    {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{file.name}</span>
                      <span className="ml-2 text-xs">({formatBytes(file.size)})</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!file || isUploading}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing PDF...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Extract PDF Metadata
                </>
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {metadata && (
            <>
              <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    PDF Metadata
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { label: 'File Name', value: metadata.filename },
                    { label: 'File Size', value: formatBytes(metadata.fileSize) },
                    { label: 'Page Count', value: metadata.pageCount.toString() },
                    { label: 'Word Count', value: metadata.wordCount.toLocaleString() },
                    { label: 'Character Count', value: metadata.characterCount.toLocaleString() },
                    { label: 'Title', value: metadata.title },
                    { label: 'Author', value: metadata.author },
                    { label: 'Subject', value: metadata.subject },
                    { label: 'Creation Date', value: formatDate(metadata.creationDate) },
                    { label: 'Modification Date', value: formatDate(metadata.modificationDate) }
                  ].map((item, index) => (
                    <motion.div key={index} variants={itemVariants} className="grid grid-cols-3 p-4 hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="col-span-2 text-gray-800">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                onClick={handleUploadToCloud}
                disabled={isCloudUploading}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="w-full flex justify-center items-center py-3 px-4 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCloudUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Upload to Cloud...
                  </>
                ) : (
                  'Upload to Cloud'
                )}
              </motion.button>

              {documentId && (
                <p className="mt-4 text-green-700 text-center">
                  PDF wgrany pomyślnie!<br />
                  Document ID: <code>{documentId}</code>
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
