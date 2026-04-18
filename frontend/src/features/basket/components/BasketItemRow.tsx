import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { removeItem, updateQuantity } from '../basketSlice';
import type { BasketItemRowProps } from '../types';
import { formatPrice } from '../utils';

export const BasketItemRow = memo(function BasketItemRow({ item, onProductClick }: BasketItemRowProps) {
  const dispatch = useDispatch();

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeItem(item.id));
  }, [dispatch, item.id]);

  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateQuantity({ id: item.id, delta: -1 }));
  }, [dispatch, item.id]);

  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.quantity < item.stock) dispatch(updateQuantity({ id: item.id, delta: 1 }));
  }, [dispatch, item.id, item.quantity, item.stock]);

  const lineTotal = formatPrice(item.price * item.quantity);

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, padding: 0, margin: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 py-3.5 px-5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={() => onProductClick(item.id)}
    >
      <div className="w-[72px] h-[72px] shrink-0 bg-white rounded-md flex items-center justify-center overflow-hidden border border-slate-100">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          width={72}
          height={72}
          loading="lazy"
          className="w-full h-full object-contain p-1.5" 
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="m-0 text-[13px] font-semibold text-blue-700 leading-snug line-clamp-2 hover:underline">
            {item.name}
          </p>
          <button
            id={`remove-item-${item.id}`}
            onClick={handleRemove}
            className="bg-transparent border-none text-slate-300 hover:text-red-500 cursor-pointer p-0.5 rounded flex items-center transition-colors shrink-0"
            title="Remove item"
            aria-label={`Remove ${item.name} from basket`}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>

        <p className="m-0 mb-2 text-[11px] text-slate-400">{item.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </button>
            <span className="px-2.5 text-[13px] font-bold text-slate-700 min-w-[24px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <span className="text-[15px] font-extrabold text-slate-900">{lineTotal}</span>
        </div>
      </div>
    </motion.div>
  );
});
