import { API_ENDPOINTS } from './constants';

export const fetchProducts = async ({ query = '', page = 0, size = 12 }: { query?: string; page?: number; size?: number } = {}) => {
  let url = `${API_ENDPOINTS.PRODUCTS}?page=${page}&size=${size}`;
  if (query) {
    url += `&query=${encodeURIComponent(query)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductById = async (id: number) => {
  const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};
