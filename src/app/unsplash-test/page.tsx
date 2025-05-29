"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function UnsplashTestPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("nature");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUnsplashImage(searchQuery: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching image: ${response.status}`);
      }
      
      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch image");
      console.error("Error fetching image:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUnsplashImage(query);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnsplashImage(query);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Unsplash Image Viewer</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search term..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      <div className="w-full max-w-2xl aspect-video relative rounded-lg overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading image...</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {imageUrl && !isLoading && !error && (
          <Image
            src={imageUrl}
            alt="Unsplash random image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
          />
        )}
      </div>
      
      {imageUrl && !isLoading && !error && (
        <p className="mt-4 text-sm text-gray-500">
          Image loaded from Unsplash based on your query: &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}