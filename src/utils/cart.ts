import type { Cart, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'cart';

export const getCart = (): Cart => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Validate cart structure
      if (isValidCart(parsedCart)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  return { items: [], total: 0 };
};

export const saveCart = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.items.find(item => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }

  cart.total = calculateTotal(cart);
  saveCart(cart);
};

export const updateQuantity = (productId: number, quantity: number): void => {
  const cart = getCart();
  
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = cart.items.find(item => item.product.id === productId);
  if (item) {
    item.quantity = Math.min(quantity, 99); // Prevent unreasonable quantities
    cart.total = calculateTotal(cart);
    saveCart(cart);
  }
};

export const removeFromCart = (productId: number): void => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product.id !== productId);
  cart.total = calculateTotal(cart);
  saveCart(cart);
};

const calculateTotal = (cart: Cart): number => {
  return cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

const isValidCart = (cart: any): cart is Cart => {
  return (
    cart &&
    Array.isArray(cart.items) &&
    typeof cart.total === 'number' &&
    cart.items.every(
      (item: any) =>
        item &&
        typeof item.quantity === 'number' &&
        item.product &&
        typeof item.product.id === 'number' &&
        typeof item.product.price === 'number'
    )
  );
};