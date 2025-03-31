<script setup lang="ts">
import { defineProps } from 'vue';
import type { Product } from '../../types';
import { addToCart } from '../../utils/cart';

const props = defineProps<{
  product: Product;
}>();

const handleAddToCart = () => {
  addToCart(props.product);
  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event('storage'));
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      :src="product.image"
      :alt="product.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-lg font-medium text-neutral-900">{{ product.name }}</h3>
      <p class="mt-1 text-sm text-neutral-500">{{ product.description }}</p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-lg font-medium text-neutral-900">${{ product.price.toFixed(2) }}</span>
        <button
          @click="handleAddToCart"
          class="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>