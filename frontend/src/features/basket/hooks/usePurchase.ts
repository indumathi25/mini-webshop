import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { clearBasket } from '../basketSlice';
import { API_ENDPOINTS } from '../../products';
import type { Product } from '../../products/types';

interface UsePurchaseProps {
  onSuccessCallback: () => void;
}

export function usePurchase({ onSuccessCallback }: UsePurchaseProps) {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (items: Product[]) => {
      const response = await fetch(API_ENDPOINTS.PURCHASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error('Failed to process checkout');
      }

      return response.text();
    },
    onSuccess: () => {
      alert('Thank you for your purchase! 🎉');
      dispatch(clearBasket());
      onSuccessCallback();
    },
    onError: (error) => {
      console.error('Purchase failed:', error);
      alert('Something went wrong. Please try again.');
    },
  });
}
