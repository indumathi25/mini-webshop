import { memo, useCallback } from 'react';
import { SORT_OPTIONS } from '../constants';
import type { ToolbarProps } from '../types';

export const Toolbar = memo(function Toolbar({
  resultCount,
  searchQuery,
  isLocalHitsActive,
  sortBy,
  onSortByChange,
}: ToolbarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onSortByChange(e.target.value),
    [onSortByChange]
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg py-3 px-4 flex items-center justify-between mb-4 flex-wrap gap-3 relative">
      <span className="text-[13px] text-slate-500 font-medium">
        <strong className="text-slate-900">{resultCount}</strong> results
        {searchQuery && <span> for <em className="italic">"{searchQuery}"</em></span>}
      </span>

      {isLocalHitsActive && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-500">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Searching server...
        </span>
      )}

      <div className="flex items-center gap-2">
        <label className="text-[13px] text-slate-500 font-medium whitespace-nowrap">Sort by:</label>
        <select
          value={sortBy}
          onChange={handleChange}
          className="py-1.5 px-2.5 border border-slate-200 rounded text-[13px] text-slate-900 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
});
