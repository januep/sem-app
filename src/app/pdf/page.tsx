'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, CalendarDays, BookOpen,
  User, Tag, Hash, Type, AlertTriangle,
  Info, LoaderCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Database } from '../lib/database.types';

type PdfDocument = Database['public']['Tables']['pdf_documents']['Row'];

const formatNumber = (num: number | null | undefined): string => {
  if (num == null) return 'N/A';
  return num.toLocaleString();
};

export default function PdfListClient() {
  const [pdfs, setPdfs] = useState<PdfDocument[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/pdf-list');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch PDFs: ${response.statusText}`);
        }
        const data: PdfDocument[] = await response.json();
        setPdfs(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || 'An unknown error occurred while fetching PDFs.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-700 p-8">
        <LoaderCircle size={48} className="mb-4 animate-spin text-blue-500" />
        <h1 className="text-2xl font-semibold">Loading Documents...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-red-600 p-8">
        <AlertTriangle size={48} className="mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Błąd ładowania PDF-ów</h1>
        <p className="text-center">{error}</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-800 p-4 sm:p-6 md:p-8">
      <header className="mb-10 text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          Uploaded PDF Documents
        </motion.h1>
        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.4 }}
          className="mt-2 text-lg text-slate-600"
        >
          Browse and manage your uploaded PDF files.
        </motion.p>
      </header>

      {pdfs && pdfs.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(59, 130, 246, 0.15), 0px 4px 6px rgba(0, 0, 0, 0.05)" }}
              className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out border border-slate-200 hover:border-blue-500"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <Link href={`/pdf/${pdf.id}`} legacyBehavior>
                      <a
                        className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors truncate"
                        title={pdf.filename}
                      >
                        {pdf.title || pdf.filename}
                      </a>
                    </Link>
                  </div>
                  <span
                    className={`ml-2 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      pdf.processed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {pdf.processed ? 'Processed' : 'Pending'}
                  </span>
                </div>

                {pdf.title && pdf.filename !== pdf.title && (
                  <p className="text-sm text-slate-500 mb-3 truncate" title={pdf.filename}>
                    Original Filename: {pdf.filename}
                  </p>
                )}

                <div className="space-y-3 text-sm text-slate-600">
                  {pdf.author && (
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-slate-400" />
                      <span>Author: <span className="font-medium text-slate-700">{pdf.author}</span></span>
                    </div>
                  )}
                  {pdf.subject && (
                    <div className="flex items-center space-x-2">
                      <Tag size={16} className="text-slate-400" />
                      <span>Subject: <span className="font-medium text-slate-700">{pdf.subject}</span></span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <CalendarDays size={16} className="text-slate-400" />
                    <span>Uploaded: <span className="font-medium text-slate-700">{new Date(pdf.uploaded_at).toLocaleDateString()} at {new Date(pdf.uploaded_at).toLocaleTimeString()}</span></span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-200/70 mt-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-slate-400" />
                      <span>Pages: <span className="font-medium text-slate-700">{formatNumber(pdf.page_count)}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Type size={16} className="text-slate-400" />
                      <span>Words: <span className="font-medium text-slate-700">{formatNumber(pdf.word_count)}</span></span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                      <Hash size={16} className="text-slate-400" />
                      <span>Chars: <span className="font-medium text-slate-700">{formatNumber(pdf.char_count)}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <Link href={`/pdf/${pdf.id}`} legacyBehavior>
                <a className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium transition-colors duration-200">
                  View Details
                </a>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center text-center py-20"
        >
          <Info size={64} className="text-slate-400 mb-6" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">No PDFs Found</h2>
          <p className="text-slate-500">Upload some documents to see them listed here.</p>
        </motion.div>
      )}
    </div>
  );
}
