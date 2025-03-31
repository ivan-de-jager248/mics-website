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
  <header class="h-[10dvh] min-h-16">
    <!-- Navigation -->
    <nav class="relative z-10 flex justify-between items-center px-8 h-full">
      <div class="flex items-center"> 
        <a href="/" class="text-2xl font-bold text-primary-600">MICS</a> 
      </div>
      
      <div class="hidden md:flex space-x-6"> 
        <a href="/" class="relative overflow-hidden px-4 py-2 font-medium group"> 
          <span class="relative z-10">Home</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a> 
        <a href="#" class="relative overflow-hidden px-4 py-2 font-medium group"> 
          <span class="relative z-10">Products</span> 
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a> 
        <a href="#" class="relative overflow-hidden px-4 py-2 font-medium group"> 
          <span class="relative z-10">Services</span> 
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a> 
        <a href="#" class="relative overflow-hidden px-4 py-2 font-medium group"> 
          <span class="relative z-10">About Us</span> 
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a> 
        <a href="#" class="relative overflow-hidden px-4 py-2 font-medium group"> 
          <span class="relative z-10">Contact</span>
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a> 
      </div> 
      
      <div class="flex items-center space-x-4">
        <!-- Cart Button (preserved from original) -->
        <button
          @click="isCartOpen = !isCartOpen"
          class="relative text-primary-600 hover:text-primary-700"
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
        
        <!-- Mobile menu button -->
        <button class="md:hidden relative z-10"> 
          <span class="material-symbols-outlined">menu</span>
        </button> 
        
        <!-- CTA Button -->
        <button
          class="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
          Get in Touch 
        </button>
      </div>
    </nav>
    
    <!-- MiniCart component (preserved from original) -->
    <MiniCart
      v-if="isCartOpen"
      :cart="cart"
      @close="isCartOpen = false"
      @update-quantity="handleUpdateQuantity"
    />
  </header>
</template>