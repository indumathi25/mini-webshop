import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

const selectItemCount = (state: RootState) => state.basket.items.reduce((total, item) => total + item.quantity, 0);
const selectTotalPrice = (state: RootState) => state.basket.totalPrice;

export const BasketIcon = ({ onClick }: { onClick: () => void }) => {
  const count = useSelector(selectItemCount);
  const total = useSelector(selectTotalPrice);

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 p-2 rounded text-blue-800 hover:bg-blue-50 transition-colors border-none bg-transparent cursor-pointer"
      aria-label={`View basket with ${count} items`}
    >
      <div className="relative">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {count > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
            {count}
          </span>
        )}
      </div>
      <span className="text-[11px] font-semibold">
        {count > 0 ? `€${typeof total === 'number' ? total.toFixed(2) : total}` : 'Basket'}
      </span>
    </button>
  );
};
