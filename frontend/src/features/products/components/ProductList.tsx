import { memo, useCallback } from 'react';
import type { ProductListProps } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { Toolbar } from './Toolbar';
import { ProductGridItem } from './ProductGridItem';

const ProductList = memo(function ProductList({
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
  isLocalHitsActive = false,
}: ProductListProps) {

  const handleRetry = useCallback(() => fetchNextPage(), [fetchNextPage]);

  if (status === 'pending' && !isLocalHitsActive) return <LoadingSpinner />;
  if (status === 'error'   && !isLocalHitsActive) return <ErrorState message={error?.message} onRetry={handleRetry} />;

  const resultCount = isLocalHitsActive ? items.length : totalItems;
  const lastIndex = items.length - 1;

  return (
    <div>
      <Toolbar
        resultCount={resultCount}
        searchQuery={searchQuery}
        isLocalHitsActive={isLocalHitsActive}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {items.map((product, index) => (
              <ProductGridItem
                key={product.id}
                product={product}
                isLast={!isLocalHitsActive && index === lastIndex}
                lastItemElementRef={lastItemElementRef}
              />
            ))}
          </div>

          {isFetchingNextPage && !isLocalHitsActive && (
            <div className="flex justify-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full" />
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
});

export default ProductList;
