import { memo } from 'react';
import type { CategoryBadgeProps } from '../types';

export const CategoryBadge = memo(function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
      {category}
    </span>
  );
});
