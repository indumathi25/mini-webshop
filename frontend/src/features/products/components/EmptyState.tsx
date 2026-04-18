import { memo } from 'react';

export const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-slate-700 font-semibold mb-2">No results found</h2>
      <p className="text-slate-600 text-sm">Try a different search term.</p>
    </div>
  );
});
