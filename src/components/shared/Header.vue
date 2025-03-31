<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Cart, Product } from '../../types';
import MiniCart from '../cart/MiniCart.vue';
import { getCart, updateQuantity } from '../../utils/cart';

const isCartOpen = ref(false);
const cart = ref<Cart>({ items: [], total: 0 });

const loadCart = () => {
  cart.value = getCart();
};

onMounted(() => {
  loadCart();
  window.addEventListener('storage', loadCart);
});

const handleUpdateQuantity = (productId: number, newQuantity: number) => {
  updateQuantity(productId, newQuantity);
  loadCart();
};

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('storage', loadCart);
});
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="text-2xl font-bold text-primary-dark">Shop</a>
      <div class="flex items-center space-x-4">
        <a href="/products" class="text-neutral-600 hover:text-neutral-900">Products</a>
        <button
          @click="isCartOpen = !isCartOpen"
          class="relative text-neutral-600 hover:text-neutral-900"
        >
          <span class="sr-only">Cart</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            v-if="cart.items.length"
            class="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cart.items.length }}
          </span>
        </button>
      </div>
    </nav>
    <MiniCart
      v-if="isCartOpen"
      :cart="cart"
      @close="isCartOpen = false"
      @update-quantity="handleUpdateQuantity"
    />
  </header>
</template>