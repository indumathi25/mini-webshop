import { memo } from 'react';
import type { DiscountBadgeProps } from '../types';

export const DiscountBadge = memo(function DiscountBadge({ pct }: DiscountBadgeProps) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
      -{pct}% off
    </span>
  );
});
