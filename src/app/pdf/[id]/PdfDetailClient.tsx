'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText, CalendarDays, BookOpen, User, Tag, Hash, Type,
  AlertTriangle, Info, LoaderCircle, CheckCircle,
  XCircle, ArrowLeft, Download, Loader
} from 'lucide-react';
import { supabaseAnonKey } from '@/app/lib/supabaseClient';
import { Database } from '@/app/lib/database.types';

type PdfDocument = Database['public']['Tables']['pdf_documents']['Row'];

interface PdfDetailClientProps {
  pdfId: string;
}

const formatNumber = (num: number | null | undefined): string =>
  num == null ? 'N/A' : num.toLocaleString();

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
  isBoolean?: boolean;
  booleanValue?: boolean;
}> = ({ icon: Icon, label, value, isBoolean = false, booleanValue = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
  >
    <Icon className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
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
        <p className="text-lg font-semibold text-slate-700">{value ?? 'N/A'}</p>
      )}
    </div>
  </motion.div>
);

export default function PdfDetailClient({ pdfId }: PdfDetailClientProps) {
  const [pdf, setPdf] = useState<PdfDocument | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pdf-list/${pdfId}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || res.statusText);
      }
      const data: PdfDocument = await res.json();
      setPdf(data);

      const { data: urlData, error: urlErr } = supabaseAnonKey
        .storage
        .from('pdfs')
        .getPublicUrl(data.path);
      if (urlErr) console.error('getPublicUrl error', urlErr);
      else setPublicUrl(urlData.publicUrl);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to load PDF.');
    } finally {
      setLoading(false);
    }
  }, [pdfId]);

  useEffect(() => {
    if (!pdfId) {
      setError('No PDF ID provided.');
      setLoading(false);
    } else {
      fetchPdfDetail();
    }
  }, [pdfId, fetchPdfDetail]);

  const handleProcess = async () => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch('/api/pdf-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: pdfId }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || res.statusText);
      }
      // re-fetch metadata
      await fetchPdfDetail();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to process PDF.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <LoaderCircle size={48} className="mb-4 animate-spin text-indigo-500" />
        <h1 className="text-2xl font-semibold">Loading PDF Details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-red-600 p-8">
        <AlertTriangle size={48} className="mb-4 text-red-600" />
        <h1 className="text-2xl font-semibold mb-2">Error</h1>
        <p className="text-center">{error}</p>
        <Link
          href="/pdf"
          className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to List
        </Link>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-700 p-8">
        <Info size={48} className="mb-4 text-slate-500" />
        <h1 className="text-2xl font-semibold">PDF Not Found</h1>
        <Link
          href="/pdf"
          className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to List
        </Link>
      </div>
    );
  }

  const title = pdf.title || pdf.filename;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 text-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-8">
          <Link
            href="/pdf"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-4 group"
          >
            <ArrowLeft size={18} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to PDF List
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-10 h-10 text-indigo-500" />
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          </div>
          {pdf.title && pdf.filename !== pdf.title && (
            <p className="text-sm text-slate-500">Original Filename: {pdf.filename}</p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <DetailItem icon={User} label="Author" value={pdf.author} />
          <DetailItem icon={Tag} label="Subject" value={pdf.subject} />
          <DetailItem
            icon={CalendarDays}
            label="Uploaded At"
            value={new Date(pdf.uploaded_at).toLocaleString()}
          />
          <DetailItem icon={CheckCircle} label="Processed" isBoolean booleanValue={pdf.processed} />
          <DetailItem icon={BookOpen} label="Pages" value={formatNumber(pdf.page_count)} />
          <DetailItem icon={Type} label="Words" value={formatNumber(pdf.word_count)} />
          <DetailItem icon={Hash} label="Chars" value={formatNumber(pdf.char_count)} />
        </div>

        <div className="flex gap-4">
          {publicUrl && (
            <a
              href={publicUrl}
              download={pdf.filename}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
            >
              <Download size={20} className="mr-2" />
              Download
            </a>
          )}
          <button
            onClick={handleProcess}
            disabled={processing}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium cursor-pointer"
          >
            {processing ? <Loader size={20} className="mr-2 animate-spin" /> : <span className="mr-2">⚙️</span>}
            {processing ? 'Processing…' : 'Process'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
