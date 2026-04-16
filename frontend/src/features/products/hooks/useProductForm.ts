import { useReducer, useCallback } from 'react';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import { API_ENDPOINTS } from '../constants';

export function useProductForm() {
  const [state, dispatch] = useReducer(productFormReducer, initialProductFormState);

  const updateField = useCallback((field: keyof typeof state, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });

    try {
      const payload = {
        name: state.name,
        description: state.description,
        category: state.category,
        imageUrl: state.imageUrl,
        price: parseFloat(state.price) || 0,
      };

      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Endpoint /api/products (POST) expects implementation on Backend.');
      }

      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', error: (error as Error).message });
    }
  }, [state]);

  return { state, updateField, handleSubmit, resetForm };
}
