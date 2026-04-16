import { useMemo } from 'react';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { fetchProducts } from '../api';
import type { Product, PaginatedResponse } from '../types';

export function useProductSearch(debouncedSearch: string, instantSearch: string) {
  const queryClient = useQueryClient();

  const queryInfo = useInfiniteQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: ({ pageParam = 0 }) => fetchProducts({ query: debouncedSearch, page: pageParam as number, size: 12 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
  });

  const localHits = useMemo(() => {
    if (instantSearch === debouncedSearch || !instantSearch) return null;

    const cachedData = queryClient.getQueryData<InfiniteData<PaginatedResponse<Product>>>(['products', '']);
    if (!cachedData) return null;

    const allCachedProducts = cachedData.pages.flatMap(page => page.content);
    
    const query = instantSearch.toLowerCase();
    const hits = allCachedProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
    
    return hits;
  }, [instantSearch, debouncedSearch, queryClient]);

  return {
    ...queryInfo,
    localHits, 
  };
}
