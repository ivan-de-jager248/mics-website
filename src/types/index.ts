export interface Product {
  id: string; // Use string ID from Astro content collection
  name: string;
  price: number;
  thumbnail?: string; // Optional thumbnail URL for cart display
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}