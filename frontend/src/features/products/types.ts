export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface ProductsState {
  searchQuery: string;
}

export interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export interface ProductAddToCartButtonProps {
  product: Product;
  fullWidth?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
  number: number;
  totalElements: number;
  first: boolean;
}

export interface ProductListProps {
  searchQuery: string;
  items: Product[];
  totalItems: number;
  status: 'error' | 'success' | 'pending';
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  lastItemElementRef: (node: HTMLDivElement | null) => void;
  isLocalHitsActive?: boolean;
}

export interface CategoryBadgeProps {
  category: string;
}

export interface DiscountBadgeProps {
  pct: number;
}

export interface PriceBlockProps {
  euros: string;
  cents: string;
  wasPrice: number | null;
  large?: boolean;
}

export interface ToolbarProps {
  resultCount: number;
  searchQuery: string;
  isLocalHitsActive: boolean;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export interface ProductGridItemProps {
  product: Product;
  isLast: boolean;
  lastItemElementRef: (node: HTMLDivElement | null) => void;
}

