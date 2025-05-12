// src/app/pdf/[id]/PdfDetailClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, CalendarDays, BookOpen, User, Tag, Hash, Type, AlertTriangle, Info, LoaderCircle, CheckCircle, XCircle, ArrowLeft
} from 'lucide-react';
import { Database } from '@/app/lib/database.types';

type PdfDocument = Database['public']['Tables']['pdf_documents']['Row'];

// Helper function to format numbers
const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString();
};

interface PdfDetailClientProps {
  pdfId: string;
}

const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string | number | null | undefined, isBoolean?: boolean, booleanValue?: boolean }> = ({
  icon: Icon, label, value, isBoolean = false, booleanValue = false
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
  >
    <Icon className="w-6 h-6 text-sky-500 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      {isBoolean ? (
        booleanValue ? (
          <span className="flex items-center text-lg font-semibold text-green-600">
            <CheckCircle size={20} className="mr-1" /> Yes
          </span>
        ) : (
          <span className="flex items-center text-lg font-semibold text-red-600">
            <XCircle size={20} className="mr-1" /> No
          </span>
        )
      ) : (
        <p className="text-lg font-semibold text-slate-700">{value || 'N/A'}</p>
      )}
    </div>
  </motion.div>
);

export default function PdfDetailClient({ pdfId }: PdfDetailClientProps) {
  const [pdf, setPdf] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfId) {
        setError("No PDF ID provided.");
        setIsLoading(false);
        return;
    };

    const fetchPdfDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/pdf-list/${pdfId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch PDF details: ${response.statusText}`);
        }
        const data: PdfDocument = await response.json();
        setPdf(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfDetail();
  }, [pdfId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <LoaderCircle size={48} className="mb-4 animate-spin text-sky-500" />
        <h1 className="text-2xl font-semibold">Loading PDF Details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-red-600 p-8">
        <AlertTriangle size={48} className="mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Error Loading PDF</h1>
        <p className="text-center">{error}</p>
        <Link href="/pdf" // TODO: Update this to your PDF list page route
              className="mt-8 inline-flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
          <ArrowLeft size={18} className="mr-2" />
          Back to List
        </Link>
      </div>
    );
  }

  if (!pdf) {
    return ( // Should ideally be caught by the error state from 404 response
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <Info size={48} className="mb-4 text-slate-500" />
        <h1 className="text-2xl font-semibold">PDF Not Found</h1>
        <Link href="/pdf" // TODO: Update this to your PDF list page route
              className="mt-8 inline-flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
          <ArrowLeft size={18} className="mr-2" />
          Back to List
        </Link>
      </div>
    );
  }

  const mainTitle = pdf.title || pdf.filename;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 text-slate-800 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-8">
          <Link href="/pdf" // TODO: Update this to your PDF list page route
                className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 mb-4 group">
            <ArrowLeft size={18} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to PDF List
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-10 h-10 text-sky-500 flex-shrink-0" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
              {mainTitle}
            </h1>
          </div>
          {pdf.title && pdf.filename !== pdf.title && (
            <p className="text-sm text-slate-500 ml-13">Original Filename: {pdf.filename}</p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <DetailItem icon={User} label="Author" value={pdf.author} />
          <DetailItem icon={Tag} label="Subject" value={pdf.subject} />
          <DetailItem icon={CalendarDays} label="Uploaded At" value={new Date(pdf.uploaded_at).toLocaleString()} />
          <DetailItem icon={CheckCircle} label="Processed" isBoolean booleanValue={pdf.processed} />
          <DetailItem icon={BookOpen} label="Page Count" value={formatNumber(pdf.page_count)} />
          <DetailItem icon={Type} label="Word Count" value={formatNumber(pdf.word_count)} />
          <DetailItem icon={Hash} label="Character Count" value={formatNumber(pdf.char_count)} />
          {/* You could add a link to the actual PDF if pdf.path is a usable URL or can be transformed into one */}
          {/* Example: <DetailItem icon={LinkIcon} label="File Path" value={pdf.path} /> */}
        </div>
        {/* Add more sections or actions here if needed */}
      </motion.div>
    </div>
  );
}