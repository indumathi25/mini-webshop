import type { Product, ProductListProps } from '../types';
import ProductCard from './ProductCard';
import { SORT_OPTIONS } from '../constants';

export default function ProductList({
  searchQuery,
  items,
  totalItems,
  status,
  error,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  sortBy,
  onSortByChange,
  lastItemElementRef,
  isLocalHitsActive
}: ProductListProps) {
  if (status === 'pending' && !isLocalHitsActive) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-slate-400 text-sm m-0">Loading products…</p>
        </div>
      </div>
    );
  }

  if (status === 'error' && !isLocalHitsActive) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Failed to load products: {error?.message}</p>
        <button 
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 text-white font-bold rounded" 
          onClick={() => fetchNextPage()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-lg py-3 px-4 flex items-center justify-between mb-4 flex-wrap gap-3 relative">
        <span className="text-[13px] text-slate-500 font-medium">
          <strong className="text-slate-900">{isLocalHitsActive ? items.length : totalItems}</strong> results
          {searchQuery && <span> for <em className="italic">"{searchQuery}"</em></span>}
        </span>
        {isLocalHitsActive && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-500">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            Searching server...
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-slate-500 font-medium whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="py-1.5 px-2.5 border border-slate-200 rounded text-[13px] text-slate-900 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-slate-700 font-semibold mb-2">No results found</h3>
          <p className="text-slate-400 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {items.map((product: Product, index: number) => {
              if (items.length === index + 1 && !isLocalHitsActive) {
                return (
                  <div ref={lastItemElementRef} key={product.id} className="animate-in fade-in duration-300">
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return (
                  <div key={product.id} className="animate-in fade-in duration-300">
                    <ProductCard product={product} />
                  </div>
                );
              }
            })}
          </div>

          {isFetchingNextPage && !isLocalHitsActive && (
            <div className="flex justify-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full"></div>
            </div>
          )}

          {!hasNextPage && items.length > 0 && !isLocalHitsActive && (
            <div className="text-center py-12 text-slate-400 text-sm">
              You've reached the end of the collection.
            </div>
          )}
        </>
      )}
    </div>
  );
}
