// interfaces/index.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  hoverImage: string;
  description: string;
  featured: boolean;
  stock: number;
  brand: string;
  discount: number; // Porcentaje de descuento (0 si no tiene)
  nutrition: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Promotion {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  brand: string;
  discount: number;
  image: string;
  hoverImage: string;
  description: string;
  featured: boolean;
  stock: number;
  productsIncluded: {
    id: number;
    name: string;
    brand: string;
    image: string;
  }[];
  nutrition: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
}

