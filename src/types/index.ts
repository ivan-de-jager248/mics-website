export interface Product {
  id: string; // Use string ID from Astro content collection
  name: string;
  thumbnail?: string; // Optional thumbnail URL for cart display
}

export interface CartItem {
  id: string; // Unique identifier for the cart item (e.g., productId_variationId)
  product: Product;
  quantity: number;
  variationId?: string; // Optional: ID of the selected variation
  variationName?: string; // Optional: Name of the selected variation
}

export interface Cart {
  items: CartItem[];
}