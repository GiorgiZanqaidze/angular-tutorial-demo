import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory, ProductFilters, FilterOption, ProductSortOption } from '../../models/product.interface';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  products: Product[] = [];
  categories: ProductCategory[] = [];
  brands: FilterOption[] = [];
  tags: FilterOption[] = [];
  priceRange = { min: 0, max: 10000 };

  // Filter state
  filters: ProductFilters = {
    searchQuery: '',
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 10000 },
    minRating: 0,
    inStockOnly: false,
    tags: [],
    sortBy: 'name',
    sortOrder: 'asc'
  };

  // UI state
  showFilters = true;
  loading = false;
  noResults = false;
  resultCount = 0;

  // Sort options
  sortOptions: Array<{value: ProductSortOption, label: string}> = [
    { value: 'name', label: 'სახელით' },
    { value: 'price', label: 'ფასით' },
    { value: 'rating', label: 'რეიტინგით' },
    { value: 'createdAt', label: 'თარიღით' },
    { value: 'popularity', label: 'პოპულარობით' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.initializeData();
    this.setupSearch();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.categories = this.productService.getCategories();
    this.brands = this.productService.getBrands();
    this.tags = this.productService.getTags();
    this.priceRange = this.productService.getPriceRange();

    // Initialize filter price range
    this.filters.priceRange = { ...this.priceRange };
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchQuery => {
      this.filters.searchQuery = searchQuery;
      this.applyFilters();
    });
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.resultCount = products.length;
          this.noResults = products.length === 0;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onSearchChange(searchQuery: string): void {
    this.searchSubject.next(searchQuery);
  }

  onCategoryChange(categoryId: string, checked: boolean): void {
    if (checked) {
      this.filters.categories = [...(this.filters.categories || []), categoryId];
    } else {
      this.filters.categories = (this.filters.categories || []).filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  onBrandChange(brand: string, checked: boolean): void {
    if (checked) {
      this.filters.brands = [...(this.filters.brands || []), brand];
    } else {
      this.filters.brands = (this.filters.brands || []).filter(b => b !== brand);
    }
    this.applyFilters();
  }

  onTagChange(tag: string, checked: boolean): void {
    if (checked) {
      this.filters.tags = [...(this.filters.tags || []), tag];
    } else {
      this.filters.tags = (this.filters.tags || []).filter(t => t !== tag);
    }
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onRatingFilterChange(rating: number): void {
    this.filters.minRating = rating === this.filters.minRating ? 0 : rating;
    this.applyFilters();
  }

  onStockFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.filters = {
      searchQuery: '',
      categories: [],
      brands: [],
      priceRange: { ...this.priceRange },
      minRating: 0,
      inStockOnly: false,
      tags: [],
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.applyFilters();
  }

  clearFilter(filterType: string): void {
    switch (filterType) {
      case 'search':
        this.filters.searchQuery = '';
        break;
      case 'categories':
        this.filters.categories = [];
        break;
      case 'brands':
        this.filters.brands = [];
        break;
      case 'price':
        this.filters.priceRange = { ...this.priceRange };
        break;
      case 'rating':
        this.filters.minRating = 0;
        break;
      case 'stock':
        this.filters.inStockOnly = false;
        break;
      case 'tags':
        this.filters.tags = [];
        break;
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    this.productService.updateFilters(this.filters);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isCategorySelected(categoryId: string): boolean {
    return this.filters.categories?.includes(categoryId) || false;
  }

  isBrandSelected(brand: string): boolean {
    return this.filters.brands?.includes(brand) || false;
  }

  isTagSelected(tag: string): boolean {
    return this.filters.tags?.includes(tag) || false;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.searchQuery?.trim()) count++;
    if (this.filters.categories?.length) count++;
    if (this.filters.brands?.length) count++;
    if (this.filters.priceRange &&
        (this.filters.priceRange.min !== this.priceRange.min ||
         this.filters.priceRange.max !== this.priceRange.max)) count++;
    if (this.filters.minRating && this.filters.minRating > 0) count++;
    if (this.filters.inStockOnly) count++;
    if (this.filters.tags?.length) count++;
    return count;
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} ₾`;
  }

  generateStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, index) => index + 1);
  }

  isStarFilled(starIndex: number, rating: number): boolean {
    return starIndex <= Math.floor(rating);
  }

  isStarHalfFilled(starIndex: number, rating: number): boolean {
    return starIndex === Math.ceil(rating) && rating % 1 !== 0;
  }
}
