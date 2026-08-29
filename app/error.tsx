'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Route Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
