import { memo } from 'react';

export const StarRating = memo(function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex gap-0.5 text-yellow-400" title={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const className =
          i < full ? 'text-[13px]'
          : i === full && half ? 'text-[13px] opacity-60'
          : 'text-[13px] text-slate-300';
        return <span key={i} className={className}>★</span>;
      })}
    </span>
  );
});
