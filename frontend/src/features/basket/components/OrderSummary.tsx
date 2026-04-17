import { memo } from 'react';
import type { OrderSummaryProps } from '../types';
import { formatPrice } from '../utils';

export const OrderSummary = memo(function OrderSummary({
  totalItemsCount, totalPrice, items, onClear, purchaseMutation,
}: OrderSummaryProps) {
  return (
    <div className="bg-white border-t border-slate-200 py-4 px-5">
      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-[13px] text-slate-500">Subtotal ({totalItemsCount} items)</span>
          <span className="text-[13px] font-semibold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[13px] text-slate-500">Shipping</span>
          <span className="text-[13px] font-semibold text-green-600">Free</span>
        </div>
        <div className="h-px bg-slate-200 my-2.5" />
        <div className="flex justify-between items-center">
          <span className="text-[15px] font-bold text-slate-900">Total</span>
          <span className="text-[22px] font-extrabold text-slate-900">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <button
        id="checkout-btn"
        onClick={() => purchaseMutation.mutate(items)}
        disabled={purchaseMutation.isPending}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px] rounded border-none cursor-pointer transition-colors disabled:opacity-75 flex justify-center items-center gap-2"
      >
        {purchaseMutation.isPending ? (
          <>
            <div className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Processing...
          </>
        ) : 'Proceed to checkout →'}
      </button>

      <button
        id="clear-basket-btn"
        onClick={onClear}
        className="w-full mt-2 bg-transparent border-none text-slate-400 hover:text-red-500 text-xs cursor-pointer p-1.5 transition-colors"
      >
        Empty basket
      </button>
    </div>
  );
});
