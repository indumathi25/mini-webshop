export type { Product } from './types';
export { fetchProducts, fetchProductById } from './api';
export { API_ENDPOINTS } from './constants';
export { default as ProductListContainer } from './components/ProductListContainer';
export { default as ProductDetailPage } from './components/ProductDetailPage';
export { SearchBar } from './components/SearchBar';
export { default as productsReducer, setSearchQuery } from './productsSlice';
