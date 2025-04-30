import type { Cart, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'cart';

// Helper to generate unique cart item ID
const generateCartItemId = (productId: string, variationId?: string): string => {
  return variationId ? `${productId}_${variationId}` : productId;
};

export const getCart = (): Cart => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Validate cart structure
      if (isValidCart(parsedCart)) {
        return parsedCart;
      } else {
        console.warn('Invalid cart structure found in localStorage. Resetting cart.');
        clearCart(); // Clear invalid cart
      }
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  return { items: [] };
};

export const saveCart = (cart: Cart): void => {
  try {
    // Ensure all items have a valid ID before saving
    cart.items.forEach(item => {
      if (!item.id) {
        item.id = generateCartItemId(item.product.id, item.variationId);
      }
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
    // Dispatch storage event for cross-component reactivity
    window.dispatchEvent(new Event('storage')); 
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Update addToCart to accept variation details
export const addToCart = (product: Product, quantity: number = 1, variationId?: string, variationName?: string): void => {
  const cart = getCart();
  const cartItemId = generateCartItemId(product.id, variationId);
  const existingItem = cart.items.find(item => item.id === cartItemId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem: CartItem = { 
      id: cartItemId, 
      product, 
      quantity, 
      variationId, 
      variationName 
    };
    cart.items.push(newItem);
  }

  saveCart(cart);
};

// Update functions to use cartItemId
export const updateQuantity = (cartItemId: string, quantity: number): void => {
  const cart = getCart();
  
  if (quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const item = cart.items.find(item => item.id === cartItemId);
  if (item) {
    item.quantity = Math.min(quantity, 99); // Prevent unreasonable quantities
    saveCart(cart);
  }
};

export const removeFromCart = (cartItemId: string): void => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== cartItemId);
  saveCart(cart);
};

export const clearCart = (): void => {
  const emptyCart: Cart = { items: [] };
  saveCart(emptyCart);
  // Dispatch storage event even when clearing
  window.dispatchEvent(new Event('storage')); 
};

// Update validation for the new CartItem structure
const isValidCart = (cart: any): cart is Cart => {
  return (
    cart &&
    Array.isArray(cart.items) &&
    cart.items.every(
      (item: any): item is CartItem => // Type assertion for item
        item &&
        typeof item.id === 'string' && // Check for unique cart item ID
        typeof item.quantity === 'number' &&
        item.product &&
        typeof item.product.id === 'string' &&
        typeof item.product.name === 'string' &&
        (item.variationId === undefined || typeof item.variationId === 'string') && // Optional variationId
        (item.variationName === undefined || typeof item.variationName === 'string') // Optional variationName
    )
  );
};