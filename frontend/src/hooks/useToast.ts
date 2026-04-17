import { useDispatch } from 'react-redux';
import { addToast } from '../store/toastSlice';
import type { ToastType } from '../store/types';
import { useCallback } from 'react';

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    dispatch(addToast({ message, type }));
  }, [dispatch]);

  return { showToast };
};
