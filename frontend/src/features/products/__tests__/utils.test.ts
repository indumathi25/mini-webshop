import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  getStockStatus,
  getWasPrice,
  getDiscountPct,
  getRating,
  getReviewCount,
  SORT_COMPARATORS,
} from '../utils';

describe('formatPrice', () => {
  it('splits price into euros and cents', () => {
    expect(formatPrice(9.99)).toEqual({ euros: '9', cents: '99' });
  });

  it('pads cents with a leading zero for round euros', () => {
    expect(formatPrice(10.0)).toEqual({ euros: '10', cents: '00' });
  });

  it('handles large prices correctly', () => {
    expect(formatPrice(1299.5)).toEqual({ euros: '1299', cents: '50' });
  });
});

describe('getStockStatus', () => {
  it('returns "Out of stock" when stock is 0', () => {
    const { label } = getStockStatus(0);
    expect(label).toBe('Out of stock');
  });

  it('returns "Only N left!" when stock is between 1 and 3', () => {
    expect(getStockStatus(1).label).toBe('Only 1 left!');
    expect(getStockStatus(3).label).toBe('Only 3 left!');
  });

  it('returns "Few left" when stock is between 4 and 10', () => {
    expect(getStockStatus(4).label).toBe('Few left');
    expect(getStockStatus(10).label).toBe('Few left');
  });

  it('returns "In stock" when stock is above 10', () => {
    expect(getStockStatus(11).label).toBe('In stock');
    expect(getStockStatus(100).label).toBe('In stock');
  });

  it('returns red color class for 0 stock', () => {
    expect(getStockStatus(0).colorClass).toBe('text-slate-400');
  });

  it('returns orange color class for few left', () => {
    expect(getStockStatus(5).colorClass).toBe('text-orange-500');
  });

  it('returns green color class for in stock', () => {
    expect(getStockStatus(20).colorClass).toBe('text-green-600');
  });
});

describe('getWasPrice', () => {
  it('returns 20% markup for id divisible by 4', () => {
    const price = 10.0;
    const wasPrice = getWasPrice(4, price);
    expect(wasPrice).toBeCloseTo(12.0, 2);
  });

  it('returns 15% markup for id divisible by 7 (but not 4)', () => {
    const price = 100.0;
    const wasPrice = getWasPrice(7, price);
    expect(wasPrice).toBeCloseTo(115.0, 2);
  });

  it('returns null for ids divisible by neither 4 nor 7', () => {
    expect(getWasPrice(1, 50)).toBeNull();
    expect(getWasPrice(3, 50)).toBeNull();
    expect(getWasPrice(9, 50)).toBeNull();
  });
});

describe('getDiscountPct', () => {
  it('calculates 20% discount correctly', () => {
    expect(getDiscountPct(25, 20)).toBe(20);
  });

  it('calculates 50% discount correctly', () => {
    expect(getDiscountPct(100, 50)).toBe(50);
  });

  it('rounds to nearest integer', () => {
    // (30 - 23) / 30 = 23.33..% → rounded to 23
    expect(getDiscountPct(30, 23)).toBe(23);
  });
});

describe('SORT_COMPARATORS', () => {
  const a = { price: 10, name: 'Apple' };
  const b = { price: 20, name: 'Banana' };

  it('price-asc sorts cheaper item first', () => {
    expect(SORT_COMPARATORS['price-asc'](a, b)).toBeLessThan(0);
  });

  it('price-desc sorts more expensive item first', () => {
    expect(SORT_COMPARATORS['price-desc'](a, b)).toBeGreaterThan(0);
  });

  it('name-asc sorts alphabetically', () => {
    expect(SORT_COMPARATORS['name-asc'](a, b)).toBeLessThan(0);
  });
});

describe('getRating', () => {
  it('returns a number between 1 and 5', () => {
    for (let i = 0; i < 20; i++) {
      const rating = getRating(i);
      expect(rating).toBeGreaterThanOrEqual(1);
      expect(rating).toBeLessThanOrEqual(5);
    }
  });
});

describe('getReviewCount', () => {
  it('returns a positive integer', () => {
    for (let i = 0; i < 20; i++) {
      const count = getReviewCount(i);
      expect(count).toBeGreaterThan(0);
      expect(Number.isInteger(count)).toBe(true);
    }
  });
});
