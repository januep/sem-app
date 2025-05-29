// src/components/GenerateGlobalSummaryButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface GenerateGlobalSummaryButtonProps {
  pdfId: string;
}

export default function GenerateGlobalSummaryButton({
  pdfId
}: GenerateGlobalSummaryButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-global-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId })
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to generate summary');
      } else {
        toast.success('Global summary created');
        router.refresh();
      }
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
      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
    >
      {loading
        ? <Loader size={20} className="mr-2 animate-spin" />
        : <span className="mr-2">📝</span>
      }
      {loading ? 'Summarizing…' : 'Generate Summary'}
    </button>
  );
}
