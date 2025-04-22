<template>
    <button v-if="isInCart" @click="handleViewCartClick" type="button" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
        View Cart
    </button>
    <button v-else @click="handleAddToCart" type="button" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors">
        Add to Cart
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getCart, addToCart } from '../../utils/cart';
import type { Product } from '../../types';

const props = defineProps<{
    product: Product;
}>();

const isInCart = ref(false);

const checkCartStatus = () => {
    const cart = getCart();
    isInCart.value = cart.items.some(item => item.product.id === props.product.id);
};

const handleAddToCart = () => {
    addToCart(props.product, 1);
    isInCart.value = true;
    window.dispatchEvent(new Event('storage'));
};

const handleViewCartClick = () => {
    // Dispatch a global custom event instead of emitting
    window.dispatchEvent(new Event('open-cart'));
};

const handleStorageChange = (event: StorageEvent | Event) => {
    if ((event instanceof StorageEvent && event.key === 'cart') || !(event instanceof StorageEvent)) {
        checkCartStatus();
    }
};

onMounted(() => {
    checkCartStatus();
    window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
});
</script>