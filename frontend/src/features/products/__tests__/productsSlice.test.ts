import { describe, it, expect } from 'vitest';
import productsReducer, { setSearchQuery } from '../productsSlice';
import type { ProductsState } from '../types';

const initialState: ProductsState = { searchQuery: '' };

describe('productsSlice reducers', () => {
  it('has correct initial state', () => {
    const state = productsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  describe('setSearchQuery', () => {
    it('updates searchQuery', () => {
      const state = productsReducer(initialState, setSearchQuery('laptop'));
      expect(state.searchQuery).toBe('laptop');
    });

    it('clears searchQuery when set to empty string', () => {
      const withQuery: ProductsState = { searchQuery: 'vinyl' };
      const state = productsReducer(withQuery, setSearchQuery(''));
      expect(state.searchQuery).toBe('');
    });

    it('overwrites a previous query', () => {
      let state = productsReducer(initialState, setSearchQuery('guitar'));
      state = productsReducer(state, setSearchQuery('drums'));
      expect(state.searchQuery).toBe('drums');
    });
  });
});
