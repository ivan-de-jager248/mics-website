<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Cart} from '../../types';
import MiniCart from '../cart/MiniCart.vue';
import { getCart, updateQuantity } from '../../utils/cart';

const isCartOpen = ref(false);
const cart = ref<Cart>({ items: [], total: 0 });

// Define links for the product dropdown
const productDropdownLinks = [
  { 
    icon: 'shelves', 
    title: 'Medical Shelving', 
    subtext: 'Durable storage solutions', 
    href: '/mics-website/products?category=medical-shelving' 
  },
  { 
    icon: 'local_shipping', 
    title: 'Medical Trolleys', 
    subtext: 'Mobile supply & instrument carts', 
    href: '/mics-website/products?category=medical-trolleys' 
  },
  { 
    icon: 'curtains', 
    title: 'Curtains & Tracks', 
    subtext: 'Privacy and track systems', 
    href: '/mics-website/products?category=curtains-and-tracks' 
  },
   { 
    icon: 'design_services', 
    title: 'Custom Solutions', 
    subtext: 'Tailored to your needs', 
    href: '/mics-website/products?category=custom-solutions' 
  },
];

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
  <header class="relative z-30 h-[10dvh] min-h-16 bg-white shadow-sm">
    <!-- Navigation -->
    <nav class="relative z-10 flex justify-between items-center px-8 h-full">
      <div class="flex items-center">
        <a href="/mics-website" class="text-4xl font-bold"><span class="text-primary-600">MI</span><span
            class="text-secondary-600">CS</span></a>
      </div>

      <div class="hidden md:flex space-x-1">
        <a href="/mics-website" class="relative overflow-hidden px-4 py-2 font-medium group">
          <span class="relative z-10">Home</span>
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        
        <!-- Products Dropdown Wrapper -->
        <div class="relative group">
          <a href="/mics-website/products" class="relative overflow-hidden px-4 py-2 font-medium flex items-center group">
            <span class="relative z-10">Products</span>
            <span class="material-symbols-outlined text-sm ml-1 transition-transform duration-200 group-hover:rotate-180">expand_more</span>
             <!-- Underline animation span - adjusted for flex container -->
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          
          <!-- Dropdown Menu - Adjusted positioning and transition -->
          <div 
            class="absolute left-0 top-full w-72 bg-white rounded-lg shadow-xl overflow-hidden
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                   transform scale-95 group-hover:scale-100 translate-y-[-5px] group-hover:translate-y-0
                   transition-all duration-200 ease-out z-50 origin-top-left">
            <div class="p-2">
              <a 
                v-for="link in productDropdownLinks" 
                :key="link.title" 
                :href="link.href" 
                class="flex items-center p-3 rounded-md hover:bg-primary-50 transition-all duration-150 group/item"
              >
                <span class="material-symbols-outlined text-primary-600 mr-3 text-xl">{{ link.icon }}</span>
                <div>
                  <p class="font-semibold text-sm text-gray-800">{{ link.title }}</p>
                  <p class="text-xs text-gray-500">{{ link.subtext }}</p>
                </div>
                 <span class="material-symbols-outlined text-gray-400 ml-auto text-lg opacity-0 group-hover/item:opacity-100 transform -translate-x-2 group-hover/item:translate-x-0 transition-all duration-200">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        <a href="/mics-website/about" class="relative overflow-hidden px-4 py-2 font-medium group">
          <span class="relative z-10">About Us</span>
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="/mics-website/contact" class="relative overflow-hidden px-4 py-2 font-medium group">
          <span class="relative z-10">Contact</span>
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Cart Button (preserved from original) -->
        <button @click="isCartOpen = !isCartOpen" class="relative text-primary-600 hover:text-primary-700">
          <span class="sr-only">Cart</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cart.items.length"
            class="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ cart.items.length }}
          </span>
        </button>

        <!-- Mobile menu button -->
        <button class="md:hidden relative z-10">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <!-- CTA Button -->
        <a href="/mics-website/contact"
          class="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
          Get in Touch
        </a>
      </div>
    </nav>

    <!-- MiniCart component (preserved from original) -->
    <MiniCart v-if="isCartOpen" :cart="cart" @close="isCartOpen = false" @update-quantity="handleUpdateQuantity" />
  </header>
</template>