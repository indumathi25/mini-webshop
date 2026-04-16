import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductCardProps } from '../types';
import { formatPrice, getRating, getReviewCount, getStockStatus, getWasPrice } from '../utils';
import { StarRating } from './StarRating';
import { ProductAddToCartButton } from './ProductAddToCartButton';

function getDiscountPct(wasPrice: number, price: number) {
  return Math.round(((wasPrice - price) / wasPrice) * 100);
}

const ProductCard = memo(function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const navigate = useNavigate();

  const rating      = getRating(product.id);
  const reviewCount = getReviewCount(product.id);
  const wasPrice    = getWasPrice(product.id, product.price);
  const { euros, cents } = formatPrice(product.price);
  const stockStatus = getStockStatus(product.id);
  const discountPct = wasPrice ? getDiscountPct(wasPrice, product.price) : null;

  const handleSelect = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const categoryBadge = (
    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
      {product.category}
    </span>
  );

  const discountBadge = discountPct && (
    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
      -{discountPct}% off
    </span>
  );

  const priceBlock = (large = false) => (
    <div className="mb-1">
      {wasPrice && <div className="text-xs text-slate-400 line-through">€{wasPrice.toFixed(2)}</div>}
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex overflow-hidden">
        <div onClick={handleSelect} className="w-40 shrink-0 bg-slate-50 flex items-center justify-center p-3 cursor-pointer">
          <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-contain rounded" />
        </div>

        <div className="flex-1 p-4 flex gap-5 items-start">
          <div className="flex-1">
            <div className="mb-1">{categoryBadge}</div>
            <h3 onClick={handleSelect} className="my-1.5 text-[15px] font-semibold text-blue-800 leading-snug cursor-pointer hover:underline">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={rating} />
              <span className="text-xs text-slate-400">({reviewCount})</span>
              <span className={`text-[11px] font-semibold ${rating >= 4.5 ? 'text-green-600' : 'text-slate-500'}`}>
                {rating >= 4.5 ? '⚡ Top Rated' : `${rating}`}
              </span>
            </div>
            <p className="text-[13px] text-slate-500 m-0 mb-2 leading-relaxed">{product.description}</p>
            <span className={`text-xs font-semibold ${stockStatus.colorClass}`}>● {stockStatus.label}</span>
          </div>

          <div className="shrink-0 text-right min-w-[160px]">
            {priceBlock(true)}
            {discountBadge && <div className="mb-3">{discountBadge}</div>}
            <ProductAddToCartButton product={product} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all flex flex-col overflow-hidden relative">
      {discountPct && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
          -{discountPct}%
        </div>
      )}

      <div onClick={handleSelect} className="bg-slate-50 p-5 flex items-center justify-center h-[180px] cursor-pointer group">
        <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[140px] object-contain transition-transform duration-300 group-hover:scale-105" />
      </div>

      <div className="px-3.5 pt-3.5 flex-1 flex flex-col">
        <div className="mb-1">{categoryBadge}</div>
        <h3 onClick={handleSelect} className="my-1.5 text-sm font-semibold text-blue-800 leading-snug cursor-pointer hover:underline line-clamp-2 min-h-[2.7em]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={rating} />
          <span className="text-[11px] text-slate-400">({reviewCount})</span>
        </div>
        {priceBlock()}
        <div className={`text-xs font-semibold ${stockStatus.colorClass} mb-1`}>● {stockStatus.label}</div>
        <div className="text-[11px] text-slate-400 mb-3">⚡ Order before 23:59, delivered tomorrow</div>
      </div>

      <div className="px-3.5 pb-3.5">
        <ProductAddToCartButton product={product} />
      </div>
    </div>
  );
});

export default ProductCard;
