import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';
import { clearBasket } from '../basketSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { usePurchase } from '../hooks/usePurchase';
import { EmptyBasket } from './EmptyBasket';
import { BasketItemRow } from './BasketItemRow';
import { OrderSummary } from './OrderSummary';

const selectBasketItems = (state: RootState) => state.basket.items;
const selectTotalPrice = (state: RootState) => state.basket.totalPrice;

export default function Basket({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const items = useSelector(selectBasketItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const purchaseMutation = usePurchase({ onSuccessCallback: onClose });

  const handleProductClick = useCallback((id: number) => {
    onClose();
    navigate(`/product/${id}`);
  }, [onClose, navigate]);

  const handleClear = useCallback(() => dispatch(clearBasket()), [dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[201] flex flex-col shadow-[-4px_0_30px_rgba(0,0,0,0.15)]"
          >
            <div className="py-4 px-5 bg-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <h2 className="m-0 text-[17px] font-bold text-white">
                  Your basket{' '}
                  {totalItemsCount > 0 && (
                    <span className="font-normal text-sm">
                      ({totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
              </div>
              <button
                id="basket-close-btn"
                onClick={onClose}
                className="bg-white/15 hover:bg-white/25 border-none rounded-full w-[34px] h-[34px] flex items-center justify-center cursor-pointer text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {items.length === 0 ? (
                <EmptyBasket onClose={onClose} />
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <BasketItemRow key={item.id} item={item} onProductClick={handleProductClick} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <OrderSummary
                totalItemsCount={totalItemsCount}
                totalPrice={totalPrice}
                items={items}
                onClear={handleClear}
                purchaseMutation={purchaseMutation}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
