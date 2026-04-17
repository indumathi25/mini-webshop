import { configureStore } from '@reduxjs/toolkit';
import { basketReducer } from '../features/basket';
import { productsReducer } from '../features/products';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    products: productsReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
