'use client';

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ProcessButtonProps {
  pdfId: string;
}

export default function ProcessButton({ pdfId }: ProcessButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/pdf-page-slice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId }),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || 'Processing failed');
      } else {
        toast.success('Processing complete');
        setHidden(true);
        router.refresh();
      }
    } catch (e: unknown) {
      console.error(e);
      toast.error('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  if (hidden) return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
    >
      {loading
        ? <Loader size={20} className="mr-2 animate-spin" />
        : <span className="mr-2">⚙️</span>
      }
      {loading ? 'Processing…' : 'Process'}
    </button>
  );
}
