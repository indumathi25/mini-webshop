import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils';

describe('basket formatPrice', () => {
  it('formats price as euro string with hyphen separator', () => {
    expect(formatPrice(9.99)).toBe('€9-99');
  });

  it('formats whole euros with 00 cents', () => {
    expect(formatPrice(10.0)).toBe('€10-00');
  });

  it('formats large prices correctly', () => {
    expect(formatPrice(1299.5)).toBe('€1299-50');
  });
});
