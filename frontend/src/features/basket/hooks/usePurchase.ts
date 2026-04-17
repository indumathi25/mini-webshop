import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { clearBasket } from '../basketSlice';
import { API_ENDPOINTS } from '../../products';
import type { BasketItem, UsePurchaseProps } from '../types';
import { useToast } from '../../../hooks/useToast';

export function usePurchase({ onSuccessCallback }: UsePurchaseProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (items: BasketItem[]) => {
      const purchaseData = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const response = await fetch(API_ENDPOINTS.PURCHASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKeyRef.current 
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Your order is already being processed! Please wait.');
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process checkout');
      }

      return response.text();
    },
    onSuccess: () => {
      showToast('Thank you for your purchase! 🎉', 'success');
      dispatch(clearBasket());
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      
      idempotencyKeyRef.current = crypto.randomUUID();
      onSuccessCallback();
    },
    onError: (error) => {
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    },
  });
}

