import type { Product } from '../products/types';

export interface BasketItem extends Product {
  quantity: number;
}

export interface BasketState {
  items: BasketItem[];
  totalPrice: number;
}
