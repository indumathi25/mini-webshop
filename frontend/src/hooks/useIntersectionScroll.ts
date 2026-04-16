import { useRef, useCallback } from 'react';

interface UseIntersectionScrollProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function useIntersectionScroll({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: UseIntersectionScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return lastItemElementRef;
}
