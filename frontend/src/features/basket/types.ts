import type { Product } from '../products/types';
import type { usePurchase } from './hooks/usePurchase';

export interface BasketItem extends Product {
  quantity: number;
}

export interface BasketState {
  items: BasketItem[];
  totalPrice: number;
}

export interface EmptyBasketProps {
  onClose: () => void;
}

export interface BasketItemRowProps {
  item: BasketItem;
  onProductClick: (id: number) => void;
}

export interface OrderSummaryProps {
  totalItemsCount: number;
  totalPrice: number;
  items: BasketItem[];
  onClear: () => void;
  purchaseMutation: ReturnType<typeof usePurchase>;
}

export interface UsePurchaseProps {
  onSuccessCallback: () => void;
}


