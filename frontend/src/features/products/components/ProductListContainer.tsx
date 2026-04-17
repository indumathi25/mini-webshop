import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntersectionScroll } from '../../../hooks/useIntersectionScroll';
import { useDebounce } from '../../../hooks/useDebounce';
import { useProductSearch } from '../hooks/useProductSearch';
import type { RootState } from '../../../store';
import ProductList from './ProductList';
import { SORT_COMPARATORS } from '../utils';

const selectSearchQuery = (state: RootState) => state.products.searchQuery;

export default function ProductListContainer() {
  const searchQuery = useSelector(selectSearchQuery);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [sortBy, setSortBy] = useState('default');

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status, localHits } =
    useProductSearch(debouncedSearch, searchQuery);

  const lastItemElementRef = useIntersectionScroll({
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });

 const items = useMemo(() => {
    if (localHits) return localHits;
    return data?.pages.flatMap(page => page.content) ?? [];
  }, [data, localHits]);

 const sortedItems = useMemo(() => {
    const comparator = SORT_COMPARATORS[sortBy];
    return comparator ? [...items].sort(comparator) : items;
  }, [items, sortBy]);

  const totalItems = useMemo(() => {
    if (localHits) return localHits.length;
    return data?.pages[0]?.totalElements ?? 0;
  }, [data, localHits]);

  const handleSortChange = useCallback((value: string) => setSortBy(value), []);

  return (
    <ProductList
      searchQuery={searchQuery}
      items={sortedItems}
      totalItems={totalItems}
      status={status}
      error={error as Error | null}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      sortBy={sortBy}
      onSortByChange={handleSortChange}
      lastItemElementRef={lastItemElementRef}
      isLocalHitsActive={!!localHits}
    />
  );
}
