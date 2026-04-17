import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../products/types';
import type { BasketItem, BasketState } from './types';

const loadBasket = (): BasketState => {
    const saved = localStorage.getItem('webshop_basket');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.items) && parsed.items.length > 0 && !('quantity' in parsed.items[0])) {
        const groupedItems: BasketItem[] = [];
        let totalPrice = 0;
        parsed.items.forEach((item: Product) => {
          const existing = groupedItems.find(i => i.id === item.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            groupedItems.push({ ...item, quantity: 1 });
          }
          totalPrice += item.price;
        });
        return { items: groupedItems, totalPrice: Number(totalPrice.toFixed(2)) };
      }
      return parsed;
    }
  
  return { items: [], totalPrice: 0 };
};

const initialState: BasketState = loadBasket();

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        if (existingItem.quantity < action.payload.stock) {
          existingItem.quantity += 1;
          state.totalPrice = Number((state.totalPrice + action.payload.price).toFixed(2));
        } else {
          return; 
        }
      } else {
        if (action.payload.stock > 0) {
          state.items.push({ ...action.payload, quantity: 1 });
          state.totalPrice = Number((state.totalPrice + action.payload.price).toFixed(2));
        } else {
          return;
        }
      }
      localStorage.setItem('webshop_basket', JSON.stringify(state));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        const newQuantity = item.quantity + action.payload.delta;
        
        if (newQuantity <= 0) {
          state.totalPrice = Number((state.totalPrice - (item.price * item.quantity)).toFixed(2));
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else if (newQuantity <= item.stock) {
          item.quantity = newQuantity;
          state.totalPrice = Number((state.totalPrice + (item.price * action.payload.delta)).toFixed(2));
        } else {
          return;
        }
        localStorage.setItem('webshop_basket', JSON.stringify(state));
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        state.totalPrice = Number((state.totalPrice - (item.price * item.quantity)).toFixed(2));
        state.items = state.items.filter(i => i.id !== action.payload);
        localStorage.setItem('webshop_basket', JSON.stringify(state));
      }
    },
    clearBasket: (state) => {
      state.items = [];
      state.totalPrice = 0;
      localStorage.removeItem('webshop_basket');
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
