export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  imageUrl: string;
  tags: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFilters {
  searchQuery?: string;
  categories?: string[];
  brands?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  minRating?: number;
  inStockOnly?: boolean;
  tags?: string[];
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';
}

export type ProductSortOption =
  | 'name'
  | 'price'
  | 'rating'
  | 'createdAt'
  | 'popularity';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}
