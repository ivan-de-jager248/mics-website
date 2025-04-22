<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Cart } from '../../types';
import MiniCart from '../cart/MiniCart.vue';
import { getCart, updateQuantity } from '../../utils/cart';

const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false); // State for mobile menu
const cart = ref<Cart>({ items: [], total: 0 });

// Define links for the product dropdown (kept separate for clarity within navLinks)
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

// Consolidated navigation links for both desktop and mobile
const navLinks = ref([
  { title: 'Home', href: '/mics-website', hasDropdown: false },
  {
    title: 'Products',
    href: '/mics-website/products',
    hasDropdown: true,
    dropdownLinks: productDropdownLinks // Nest dropdown links here
  },
  { title: 'About Us', href: '/mics-website/about', hasDropdown: false },
  { title: 'Contact', href: '/mics-website/contact', hasDropdown: false },
]);


const loadCart = () => {
  cart.value = getCart();
};

const handleUpdateQuantity = (productId: number, newQuantity: number) => {
  updateQuantity(productId, newQuantity);
  loadCart();
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Watch for mobile menu state changes to potentially disable body scroll
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});


onMounted(() => {
  loadCart();
  window.addEventListener('storage', loadCart);
});

// Clean up event listener and body style
onUnmounted(() => {
  window.removeEventListener('storage', loadCart);
  document.body.style.overflow = ''; // Ensure scroll is re-enabled on unmount
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

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-1">
        <template v-for="link in navLinks" :key="link.title">
          <!-- Regular Link -->
          <a v-if="!link.hasDropdown" :href="link.href" class="relative overflow-hidden px-4 py-2 font-medium group">
            <span class="relative z-10">{{ link.title }}</span>
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
          </a>

          <!-- Products Dropdown Wrapper -->
          <div v-else class="relative group">
            <a :href="link.href" class="relative overflow-hidden px-4 py-2 font-medium flex items-center group">
              <span class="relative z-10">{{ link.title }}</span>
              <span
                class="material-symbols-outlined text-sm ml-1 transition-transform duration-200 group-hover:rotate-180">expand_more</span>
              <!-- Underline animation span -->
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </a>

            <!-- Dropdown Menu -->
            <div class="absolute left-0 top-full w-72 bg-white rounded-lg shadow-xl overflow-hidden
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible
                     transform scale-95 group-hover:scale-100 translate-y-[-5px] group-hover:translate-y-0
                     transition-all duration-200 ease-out z-50 origin-top-left">
              <div class="p-2">
                <a v-for="dropdownLink in link.dropdownLinks" :key="dropdownLink.title" :href="dropdownLink.href"
                  class="flex items-center p-3 rounded-md hover:bg-primary-50 transition-all duration-150 group/item">
                  <span class="material-symbols-outlined text-primary-600 mr-3 text-xl">{{ dropdownLink.icon }}</span>
                  <div>
                    <p class="font-semibold text-sm text-gray-800">{{ dropdownLink.title }}</p>
                    <p class="text-xs text-gray-500">{{ dropdownLink.subtext }}</p>
                  </div>
                  <span
                    class="material-symbols-outlined text-gray-400 ml-auto text-lg opacity-0 group-hover/item:opacity-100 transform -translate-x-2 group-hover/item:translate-x-0 transition-all duration-200">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Cart Button -->
        <button @click="isCartOpen = !isCartOpen" class="relative text-primary-600 hover:text-primary-700">
          <!-- ... existing cart svg and badge ... -->
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
        <button @click="toggleMobileMenu" class="md:hidden relative z-50 text-primary-600 hover:text-primary-700">
          <span class="sr-only">Toggle menu</span>
          <span class="material-symbols-outlined transition-transform duration-300">
            menu
          </span>
        </button>

        <!-- CTA Button -->
        <a href="/mics-website/contact"
          class="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
          Get in Touch
        </a>
      </div>
    </nav>

    <!-- MiniCart component -->
    <MiniCart v-if="isCartOpen" :cart="cart" @close="isCartOpen = false" @update-quantity="handleUpdateQuantity" />

    <!-- Mobile Menu Overlay -->
    <transition enter-active-class="transition ease-out duration-300 transform" enter-from-class="translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-white md:hidden flex flex-col">
        <!-- Mobile Menu Header -->
        <div class="flex justify-between items-center px-8 h-[10dvh] min-h-16 border-b border-gray-200">
          <a href="/mics-website" class="text-4xl font-bold"><span class="text-primary-600">MI</span><span
              class="text-secondary-600">CS</span></a>

          <!-- Close button -->
          <button @click="toggleMobileMenu" class="md:hidden relative z-50 text-primary-600 hover:text-primary-700">
            <span class="sr-only">Toggle menu</span>
            <span class="material-symbols-outlined transition-transform duration-300">
              close
            </span>
          </button>
        </div>

        <!-- Mobile Menu Links -->
        <nav class="flex-grow p-8 space-y-6 overflow-y-auto">
          <template v-for="link in navLinks" :key="link.title + '-mobile'">
            <a :href="link.href" @click="toggleMobileMenu"
              class="block text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors">
              {{ link.title }}
            </a>
            <!-- Product Sub-links for Mobile -->
            <div v-if="link.hasDropdown" class="pl-4 mt-2 space-y-3 border-l border-gray-200">
              <a v-for="dropdownLink in link.dropdownLinks" :key="dropdownLink.title + '-mobile'"
                :href="dropdownLink.href" @click="toggleMobileMenu"
                class="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors group">
                <span class="material-symbols-outlined text-primary-500 mr-2 text-base">{{ dropdownLink.icon }}</span>
                <span>{{ dropdownLink.title }}</span>
                <span
                  class="material-symbols-outlined text-gray-400 ml-auto text-sm opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200">arrow_forward</span>
              </a>
            </div>
          </template>
        </nav>

        <!-- Mobile Menu Footer/CTA -->
        <div class="p-8 border-t border-gray-200">
          <a href="/mics-website/contact" @click="toggleMobileMenu"
            class="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            Get in Touch
          </a>
        </div>
      </div>
    </transition>

  </header>
</template>