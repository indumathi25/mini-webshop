import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntersectionScroll } from '../../../hooks/useIntersectionScroll';
import { useDebounce } from '../../../hooks/useDebounce';
import { useProductSearch } from '../hooks/useProductSearch';
import type { RootState } from '../../../store';
import ProductList from './ProductList';

export default function ProductListContainer() {
  const searchQuery = useSelector((state: RootState) => state.products.searchQuery);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [sortBy, setSortBy] = useState('default');
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    localHits
  } = useProductSearch(debouncedSearch, searchQuery);

  const lastItemElementRef = useIntersectionScroll({
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });

  const items = useMemo(() => {
    if (localHits) return localHits;

    if (!data) return [];
    return data.pages.flatMap(page => page.content);
  }, [data, localHits]);

  const sortedItems = useMemo(() => {
    const result = [...items];
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [items, sortBy]);

  return (
    <ProductList
      searchQuery={searchQuery}
      items={sortedItems}
      totalItems={items.length}
      status={status}
      error={error as Error | null}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      lastItemElementRef={lastItemElementRef}
      isLocalHitsActive={!!localHits}
    />
  );
}
