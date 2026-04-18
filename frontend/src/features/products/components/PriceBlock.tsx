import { memo } from 'react';
import type { PriceBlockProps } from '../types';

export const PriceBlock = memo(function PriceBlock({ euros, cents, wasPrice, large = false }: PriceBlockProps) {
  return (
    <div className="mb-1">
      <div className="text-xs text-slate-700 line-through min-h-[1.2rem]">
        {wasPrice ? `€${wasPrice.toFixed(2)}` : ''}
      </div>
      <div className="text-slate-900">
        <span className={`font-extrabold ${large ? 'text-[22px]' : 'text-xl'}`}>
          €{euros}
          <span className={`font-semibold align-super ${large ? 'text-[14px]' : 'text-[13px]'}`}>
            -{cents}
          </span>
        </span>
      </div>
    </div>
  );
});
