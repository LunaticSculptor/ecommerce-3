export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  slug: string;
}

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  categoryLink: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  category: Category;
  imageUrls: string[];
  availableColors: string[];
}
