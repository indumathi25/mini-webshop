export const RATINGS_LIST = [4.1, 4.3, 4.5, 4.7, 4.8, 3.9, 4.2, 4.6, 4.4, 4.0];

export const REVIEW_COUNTS = [142, 89, 304, 56, 211, 78, 423, 167, 34, 512];

export const STOCK_LEVELS = [14, 7, 5, 32, 9, 11, 18, 23, 6, 15, 4, 41];

export const SORT_OPTIONS = [
  { value: 'default', label: 'Best match' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PURCHASE: `${API_BASE_URL}/products/purchase`,
};
