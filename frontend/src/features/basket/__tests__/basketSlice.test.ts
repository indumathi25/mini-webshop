import { describe, it, expect, beforeEach } from 'vitest';
import basketReducer, {
  addItem,
  updateQuantity,
  removeItem,
  clearBasket,
} from '../basketSlice';
import type { BasketState } from '../types';
import type { Product } from '../../products/types';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Vinyl Record',
  description: 'A classic',
  price: 19.99,
  imageUrl: 'http://img.url',
  category: 'Music',
  stock: 10,
  ...overrides,
});

const emptyState: BasketState = { items: [], totalPrice: 0 };

describe('basketSlice reducers', () => {
  beforeEach(() => localStorageMock.clear());

 describe('addItem', () => {
    it('adds a new product to an empty basket', () => {
      const product = makeProduct();
      const state = basketReducer(emptyState, addItem(product));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalPrice).toBeCloseTo(19.99, 2);
    });

    it('increments quantity when same product is added again', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, addItem(product));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalPrice).toBeCloseTo(39.98, 2);
    });

    it('does NOT add an out-of-stock product', () => {
      const product = makeProduct({ stock: 0 });
      const state = basketReducer(emptyState, addItem(product));

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBe(0);
    });

    it('does NOT exceed stock limit', () => {
      const product = makeProduct({ stock: 1 });
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, addItem(product)); // try to add above stock

      expect(state.items[0].quantity).toBe(1);
      expect(state.totalPrice).toBeCloseTo(19.99, 2);
    });

    it('adds two different products independently', () => {
      const p1 = makeProduct({ id: 1, price: 10 });
      const p2 = makeProduct({ id: 2, price: 20, name: 'Guitar' });
      let state = basketReducer(emptyState, addItem(p1));
      state = basketReducer(state, addItem(p2));

      expect(state.items).toHaveLength(2);
      expect(state.totalPrice).toBeCloseTo(30, 2);
    });
  });

  describe('updateQuantity', () => {
    it('increments quantity and totalPrice with delta +1', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, updateQuantity({ id: 1, delta: 1 }));

      expect(state.items[0].quantity).toBe(2);
      expect(state.totalPrice).toBeCloseTo(39.98, 2);
    });

    it('removes item from basket when quantity drops to 0', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, updateQuantity({ id: 1, delta: -1 }));

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBeCloseTo(0, 2);
    });

    it('does NOT update when new quantity exceeds stock', () => {
      const product = makeProduct({ stock: 2 });
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, addItem(product)); // quantity = 2 (at stock limit)
      state = basketReducer(state, updateQuantity({ id: 1, delta: 1 })); // try to exceed

      expect(state.items[0].quantity).toBe(2);
    });

    it('does nothing when item id does not exist', () => {
      const state = basketReducer(emptyState, updateQuantity({ id: 999, delta: 1 }));
      expect(state).toEqual(emptyState);
    });
  });

  describe('removeItem', () => {
    it('removes item and adjusts totalPrice', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, removeItem(1));

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBeCloseTo(0, 2);
    });

    it('adjusts totalPrice correctly when removing multi-quantity item', () => {
      const product = makeProduct({ price: 10 });
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, addItem(product)); // qty = 2, total = 20
      state = basketReducer(state, removeItem(1));

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBeCloseTo(0, 2);
    });

    it('does nothing when id does not exist in basket', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, removeItem(999));

      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearBasket', () => {
    it('empties items and resets totalPrice to 0', () => {
      const product = makeProduct();
      let state = basketReducer(emptyState, addItem(product));
      state = basketReducer(state, clearBasket());

      expect(state.items).toHaveLength(0);
      expect(state.totalPrice).toBe(0);
    });

    it('is idempotent on an already empty basket', () => {
      const state = basketReducer(emptyState, clearBasket());
      expect(state).toEqual({ items: [], totalPrice: 0 });
    });
  });
});
