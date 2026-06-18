// interfaces/index.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  stock: number;
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
