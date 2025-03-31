<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Cart } from '../../types';
import { removeFromCart } from '../../utils/cart';

const props = defineProps<{
  cart: Cart;
}>();

const emit = defineEmits(['close', 'update-quantity']);

const handleRemove = (productId: number) => {
  removeFromCart(productId);
  window.dispatchEvent(new Event('storage'));
};
</script>

<template>
  <div class="fixed inset-0 z-30" @click="emit('close')">
    <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    <div
      class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform"
      @click.stop
    >
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium">Shopping Cart</h2>
          <button
            @click="emit('close')"
            class="text-neutral-400 hover:text-neutral-500 transition-colors"
          >
            <span class="sr-only">Close</span>
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="p-4">
        <div v-if="cart.items.length === 0" class="text-center py-8">
          <p class="text-neutral-500">Your cart is empty</p>
        </div>
        <div v-else>
          <ul class="divide-y divide-neutral-200">
            <li
              v-for="item in cart.items"
              :key="item.product.id"
              class="py-4 flex"
            >
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="h-20 w-20 object-cover rounded"
              />
              <div class="ml-4 flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-sm font-medium">{{ item.product.name }}</h3>
                  <p class="text-sm font-medium text-neutral-900">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
                <div class="mt-1 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <button
                      class="text-sm text-primary-dark hover:text-primary transition-colors px-2"
                      @click="emit('update-quantity', item.product.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="text-sm">{{ item.quantity }}</span>
                    <button
                      class="text-sm text-primary-dark hover:text-primary transition-colors px-2"
                      @click="emit('update-quantity', item.product.id, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click="handleRemove(item.product.id)"
                    class="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <div class="mt-4 border-t pt-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Total</span>
              <span class="text-lg font-medium">${{ cart.total.toFixed(2) }}</span>
            </div>
            <a
              href="/checkout"
              class="mt-4 block w-full bg-accent hover:bg-accent-dark text-white text-center py-2 px-4 rounded-md transition-colors duration-200"
            >
              Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>