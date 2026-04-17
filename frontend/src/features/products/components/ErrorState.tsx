import { memo } from 'react';
import type { ErrorStateProps } from '../types';

export const ErrorState = memo(function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <p className="text-slate-500 mb-4">Failed to load products: {message}</p>
      <button
        className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white font-bold rounded"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
});
