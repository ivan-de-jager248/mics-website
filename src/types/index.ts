export interface Product {
  id: string; // Use string ID from Astro content collection
  name: string;
  thumbnail?: string; // Optional thumbnail URL for cart display
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}