import { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../basket';
import { useToast } from '../../../hooks/useToast';
import type { RootState } from '../../../store';
import type { ProductAddToCartButtonProps } from '../types';

export const ProductAddToCartButton = memo(function ProductAddToCartButton({ product, fullWidth = true }: ProductAddToCartButtonProps) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  const basketQuantity = useSelector((state: RootState) => {
    const item = state.basket.items.find(i => i.id === product.id);
    return item ? item.quantity : 0;
  });

  const isMaxStockReached = useMemo(() => basketQuantity >= product.stock, [basketQuantity, product.stock]);

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMaxStockReached) {
      dispatch(addItem(product));
      showToast(`Added ${product.name} to basket`);
    }
  }, [dispatch, product, isMaxStockReached, showToast]);

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock <= 0 || isMaxStockReached}
      className={`${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-1.5 py-2 px-4 rounded text-sm font-bold border-none transition-colors ${
        product.stock <= 0 || isMaxStockReached
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
          : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
      }`}
    >
      {product.stock <= 0 ? (
        'Out of stock'
      ) : isMaxStockReached ? (
        'Max stock reached'
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Add to basket
        </>
      )}
    </button>
  );
});
