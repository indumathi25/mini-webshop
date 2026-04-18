import { memo } from 'react';
import ProductCard from './ProductCard';
import type { ProductGridItemProps } from '../types';

export const ProductGridItem = memo(function ProductGridItem({
  product,
  isLast,
  lastItemElementRef,
}: ProductGridItemProps) {
  return (
    <div
      ref={isLast ? lastItemElementRef : undefined}
      className="animate-in fade-in duration-300"
    >
      <ProductCard product={product} />
    </div>
  );
});
