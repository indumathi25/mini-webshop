import { memo } from 'react';
import type { EmptyBasketProps } from '../types';

export const EmptyBasket = memo(function EmptyBasket({ onClose }: EmptyBasketProps) {
  return (
    <div className="text-center py-16 px-5">
      <div className="text-6xl mb-3">🛒</div>
      <h3 className="text-slate-700 m-0 mb-2 text-lg">Your basket is empty</h3>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded border-none cursor-pointer inline-flex transition-colors"
        onClick={onClose}
      >
        Continue shopping
      </button>
    </div>
  );
});
