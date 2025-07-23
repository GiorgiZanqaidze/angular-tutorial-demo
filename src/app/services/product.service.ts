import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Product, ProductCategory, ProductFilters, FilterOption, ProductSortOption } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private categories: ProductCategory[] = [];

  private filtersSubject = new BehaviorSubject<ProductFilters>({});
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.initializeMockData();
    this.productsSubject.next(this.products);
  }

  private initializeMockData(): void {
    // Categories
    this.categories = [
      { id: '1', name: 'ელექტრონიკა', slug: 'electronics' },
      { id: '2', name: 'ტანსაცმელი', slug: 'clothing' },
      { id: '3', name: 'წიგნები', slug: 'books' },
      { id: '4', name: 'სპორტი', slug: 'sports' },
      { id: '5', name: 'სახლი და ბაღი', slug: 'home-garden' },
      { id: '6', name: 'სილამაზე', slug: 'beauty' }
    ];

    // Products
    this.products = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'უახლესი Apple-ის სმარტფონი პროფესიონალური კამერით',
        price: 2999,
        originalPrice: 3299,
        category: this.categories[0],
        brand: 'Apple',
        rating: 4.8,
        reviewCount: 245,
        inStock: true,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
        tags: ['premium', 'new', 'bestseller'],
        features: ['A17 Pro chip', '48MP Camera', '5G'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        description: 'ინოვაციური Android სმარტფონი AI ფუნქციებით',
        price: 2599,
        category: this.categories[0],
        brand: 'Samsung',
        rating: 4.6,
        reviewCount: 189,
        inStock: true,
        stockQuantity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
        tags: ['android', 'ai', 'bestseller'],
        features: ['AI Photography', '120Hz Display', 'S Pen'],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Nike Air Max 270',
        description: 'კომფორტული სპორტული ფეხსაცმელი ყოველდღიური ტარებისთვის',
        price: 450,
        originalPrice: 520,
        category: this.categories[3],
        brand: 'Nike',
        rating: 4.4,
        reviewCount: 156,
        inStock: true,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
        tags: ['sport', 'comfortable', 'lifestyle'],
        features: ['Air Cushioning', 'Breathable', 'Lightweight'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Adidas Ultraboost 22',
        description: 'პრემიუმ სირბილის ფეხსაცმელი ენერგიის დაბრუნებით',
        price: 380,
        category: this.categories[3],
        brand: 'Adidas',
        rating: 4.7,
        reviewCount: 203,
        inStock: false,
        stockQuantity: 0,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
        tags: ['sport', 'running', 'premium'],
        features: ['Boost Technology', 'Primeknit Upper', 'Energy Return'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'MacBook Pro 14"',
        description: 'პროფესიონალური ლეპტოპი M3 ჩიპით კრეატიებისთვის',
        price: 4599,
        category: this.categories[0],
        brand: 'Apple',
        rating: 4.9,
        reviewCount: 89,
        inStock: true,
        stockQuantity: 5,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
        tags: ['premium', 'professional', 'new'],
        features: ['M3 Chip', 'Liquid Retina XDR', '22-hour battery'],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Zara ზამთრის ქურთუკი',
        description: 'ელეგანტური ზამთრის ქურთუკი ქალებისთვის',
        price: 180,
        originalPrice: 220,
        category: this.categories[1],
        brand: 'Zara',
        rating: 4.2,
        reviewCount: 78,
        inStock: true,
        stockQuantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=300&fit=crop',
        tags: ['fashion', 'winter', 'elegant'],
        features: ['Water Resistant', 'Warm Lining', 'Stylish Cut'],
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date()
      },
      {
        id: '7',
        name: 'H&M მაისური',
        description: 'კომფორტული ყოველდღიური მაისური სხვადასხვა ფერებში',
        price: 25,
        category: this.categories[1],
        brand: 'H&M',
        rating: 4.0,
        reviewCount: 124,
        inStock: true,
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        tags: ['casual', 'basic', 'affordable'],
        features: ['100% Cotton', 'Machine Washable', 'Various Colors'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '8',
        name: 'ჰარი პოტერი - სრული კოლექცია',
        description: 'J.K. Rowling-ის ჰარი პოტერის სრული კოლექცია ქართულად',
        price: 120,
        category: this.categories[2],
        brand: 'Scholastic',
        rating: 4.9,
        reviewCount: 445,
        inStock: true,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
        tags: ['books', 'fantasy', 'bestseller', 'collection'],
        features: ['Georgian Translation', 'Hardcover', 'Complete Series'],
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date()
      },
      {
        id: '9',
        name: 'PlayStation 5',
        description: 'ახალი თაობის გეიმინგ კონსოლი 4K გრაფიკით',
        price: 1299,
        category: this.categories[0],
        brand: 'Sony',
        rating: 4.8,
        reviewCount: 312,
        inStock: true,
        stockQuantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop',
        tags: ['gaming', 'new', 'premium', 'entertainment'],
        features: ['4K Gaming', 'Ray Tracing', 'SSD Storage'],
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date()
      },
      {
        id: '10',
        name: 'IKEA სამუშაო მაგიდა',
        description: 'თანამედროვე დიზაინის სამუშაო მაგიდა სახლისთვის',
        price: 150,
        category: this.categories[4],
        brand: 'IKEA',
        rating: 4.3,
        reviewCount: 67,
        inStock: true,
        stockQuantity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
        tags: ['furniture', 'modern', 'home-office'],
        features: ['Adjustable Height', 'Cable Management', 'Easy Assembly'],
        createdAt: new Date('2023-12-10'),
        updatedAt: new Date()
      },
      {
        id: '11',
        name: 'L\'Oréal სახის კრემი',
        description: 'ანტი-ეიჯინგ სახის კრემი ყველა ტიპის კანისთვის',
        price: 45,
        originalPrice: 55,
        category: this.categories[5],
        brand: 'L\'Oréal',
        rating: 4.1,
        reviewCount: 198,
        inStock: true,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
        tags: ['beauty', 'skincare', 'anti-aging'],
        features: ['Anti-Aging', 'Moisturizing', 'SPF Protection'],
        createdAt: new Date('2023-12-05'),
        updatedAt: new Date()
      },
      {
        id: '12',
        name: 'Canon EOS R5',
        description: 'პროფესიონალური უკადრო კამერა 45MP რეზოლუციით',
        price: 8599,
        category: this.categories[0],
        brand: 'Canon',
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        stockQuantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
        tags: ['professional', 'photography', 'premium'],
        features: ['45MP Sensor', '8K Video', 'In-Body Stabilization'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ];
  }

  // Public methods
  getProducts(): Observable<Product[]> {
    return combineLatest([
      this.productsSubject.asObservable(),
      this.filtersSubject.asObservable()
    ]).pipe(
      map(([products, filters]) => this.applyFilters(products, filters))
    );
  }

  getCategories(): ProductCategory[] {
    return this.categories;
  }

  getBrands(): FilterOption[] {
    const brands = [...new Set(this.products.map(p => p.brand))];
    return brands.map(brand => ({
      value: brand,
      label: brand,
      count: this.products.filter(p => p.brand === brand).length
    }));
  }

  getTags(): FilterOption[] {
    const allTags = this.products.flatMap(p => p.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.map(tag => ({
      value: tag,
      label: tag,
      count: this.products.filter(p => p.tags.includes(tag)).length
    }));
  }

  getPriceRange(): { min: number; max: number } {
    const prices = this.products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  updateFilters(filters: ProductFilters): void {
    this.filtersSubject.next(filters);
  }

  getCurrentFilters(): ProductFilters {
    return this.filtersSubject.value;
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    let filteredProducts = [...products];

    // Search query filter
    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories?.length) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories!.includes(product.category.id)
      );
    }

    // Brand filter
    if (filters.brands?.length) {
      filteredProducts = filteredProducts.filter(product =>
        filters.brands!.includes(product.brand)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      );
    }

    // Rating filter
    if (filters.minRating) {
      filteredProducts = filteredProducts.filter(product =>
        product.rating >= filters.minRating!
      );
    }

    // Stock filter
    if (filters.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Tags filter
    if (filters.tags?.length) {
      filteredProducts = filteredProducts.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'createdAt':
            comparison = a.createdAt.getTime() - b.createdAt.getTime();
            break;
          case 'popularity':
            comparison = a.reviewCount - b.reviewCount;
            break;
        }

        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filteredProducts;
  }
}
