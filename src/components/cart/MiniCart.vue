<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'; // Import ref
import type { Cart } from '../../types';
import { removeFromCart, clearCart } from '../../utils/cart';

const props = defineProps<{
  cart: Cart;
  checkoutEmailID: string;
}>();

const emit = defineEmits(['close', 'update-quantity']);

// State for the quote request
const quoteStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const quoteError = ref<string | null>(null);

const handleRemove = (productId: string) => {
  removeFromCart(productId);
  window.dispatchEvent(new Event('storage'));
};

// Method to handle the quote request
const handleRequestQuote = async () => {
  quoteStatus.value = 'loading';
  quoteError.value = null;

  // Format cart items for the email body
  const itemsMessage = props.cart.items
    .map(
      (item) =>
        `${item.product.name} (ID: ${item.product.id}) - Quantity: ${
          item.quantity
        }`
    )
    .join('\n');
  const fullMessage = `Quote request details:\n\n${itemsMessage}`;

  try {
    // Replace 'your@email.com' with your actual FormSubmit email
    const response = await fetch(`https://formsubmit.co/ajax/${props.checkoutEmailID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _template: 'box',
        subject: 'New Quote Request from Website Cart',
        message: fullMessage,
      }),
    });

    if (!response.ok) {
      // Try to parse error from FormSubmit response if possible
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('FormSubmit Success:', data);
    quoteStatus.value = 'success';

    // Clear cart and notify other components
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      clearCart();
      emit('close');
    }, 3000);

  } catch (error) {
    console.error('FormSubmit Error:', error);
    quoteError.value =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    quoteStatus.value = 'error';
    // Reset status after a delay so user can see the error
    setTimeout(() => {
        if (quoteStatus.value === 'error') {
             quoteStatus.value = 'idle';
        }
    }, 5000);
  }
};
</script>

<template>
  <div class="fixed inset-0 z-30" @click="emit('close')">
    <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    <div
      class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform flex flex-col"
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
      <div class="p-4 flex-1 overflow-y-auto">
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
                :src="item.product.thumbnail"
                :alt="item.product.name"
                class="h-20 w-20 object-cover rounded"
              />
              <div class="ml-4 flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-sm font-medium">{{ item.product.name }}</h3>
                </div>
                <div class="mt-1 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <button
                      class="text-sm text-primary-dark hover:text-primary transition-colors px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="emit('update-quantity', item.product.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1 || quoteStatus === 'loading'"
                    >
                      -
                    </button>
                    <span class="text-sm">{{ item.quantity }}</span>
                    <button
                      class="text-sm text-primary-dark hover:text-primary transition-colors px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="emit('update-quantity', item.product.id, item.quantity + 1)"
                      :disabled="quoteStatus === 'loading'"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click="handleRemove(item.product.id)"
                    class="text-sm text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="quoteStatus === 'loading'"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="cart.items.length > 0" class="p-4 border-t">
        <button
          @click="handleRequestQuote"
          :disabled="quoteStatus === 'loading' || quoteStatus === 'success'"
          class="mt-4 block w-full bg-primary hover:bg-primary-dark text-white text-center py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="quoteStatus === 'idle' || quoteStatus === 'error'">Request Quote</span>
          <span v-if="quoteStatus === 'loading'">Sending Request...</span>
          <span v-if="quoteStatus === 'success'">Quote Requested!</span>
        </button>
        <p v-if="quoteStatus === 'error' && quoteError" class="mt-2 text-sm text-red-600 text-center">
          Error: {{ quoteError }}
        </p>
        <p v-if="quoteStatus === 'success'" class="mt-2 text-sm text-green-600 text-center">
          Your quote request has been sent successfully. We will contact you shortly.
        </p>
      </div>
    </div>
  </div>
</template>