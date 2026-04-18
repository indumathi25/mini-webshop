import { memo } from 'react';

export const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full mb-4" />
        <p className="text-slate-600 text-sm m-0">Loading products…</p>
      </div>
    </div>
  );
});
