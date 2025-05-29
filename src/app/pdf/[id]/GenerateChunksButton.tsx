// src/components/GenerateChunksButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface GenerateChunksButtonProps {
  pdfId: string;
}

export default function GenerateChunksButton({ pdfId }: GenerateChunksButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-chunks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to generate chunks');
      } else {
        toast.success(`Created ${json.count} chunks`);
        router.refresh();
      }
    } catch (e: any) {
      console.error('generate-chunks error:', e);
      toast.error(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm font-medium"
    >
      {loading 
        ? <Loader size={20} className="mr-2 animate-spin" /> 
        : <span className="mr-2">🔪</span>
      }
      {loading ? 'Chunking…' : 'Generate Chunks'}
    </button>
  );
}
