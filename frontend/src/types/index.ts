export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

// This interface represents the cart state as an object where the key is product_id
export interface CartState {
  items: Record<string, CartItem>;
}

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface FilterState {
  selectedCategory: string | 'all';
}