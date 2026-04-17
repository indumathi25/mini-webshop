import { RATINGS_LIST, REVIEW_COUNTS } from './constants';

export function getRating(id: number) {
  return RATINGS_LIST[id % RATINGS_LIST.length];
}

export function getReviewCount(id: number) {
  return REVIEW_COUNTS[id % REVIEW_COUNTS.length];
}

export function formatPrice(price: number) {
  const parts = price.toFixed(2).split('.');
  return { euros: parts[0], cents: parts[1] };
}

export function getWasPrice(id: number, price: number): number | null {
  if (id % 4 === 0) return Math.round(price * 1.2 * 100) / 100;
  if (id % 7 === 0) return Math.round(price * 1.15 * 100) / 100;
  return null;
}

export function getStockStatus(stock: number): { label: string; colorClass: string } {
  if (stock <= 0) return { label: 'Out of stock', colorClass: 'text-slate-400' };
  if (stock <= 3) return { label: `Only ${stock} left!`, colorClass: 'text-red-600' };
  if (stock <= 10) return { label: 'Few left', colorClass: 'text-orange-500' };
  return { label: 'In stock', colorClass: 'text-green-600' };
}

export function getDiscountPct(wasPrice: number, price: number): number {
  return Math.round(((wasPrice - price) / wasPrice) * 100);
}

export const SORT_COMPARATORS: Record<string, (a: { price: number; name: string }, b: { price: number; name: string }) => number> = {
  'price-asc':  (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc':   (a, b) => a.name.localeCompare(b.name),
};


