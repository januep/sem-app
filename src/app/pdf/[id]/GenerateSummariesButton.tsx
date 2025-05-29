// src/components/GenerateSummariesButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface GenerateSummariesButtonProps {
  pdfId: string;
}

export default function GenerateSummariesButton({ pdfId }: GenerateSummariesButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      toast.success('Summaries generated');
      router.refresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
    >
      {loading
        ? <Loader size={20} className="mr-2 animate-spin" />
        : <span className="mr-2">📝</span>
      }
      {loading ? 'Generating…' : 'Generate summaries'}
    </button>
  );
}
