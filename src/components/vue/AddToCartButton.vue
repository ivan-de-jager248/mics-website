<template>
    <button v-if="isInCart" @click="handleViewCartClick" type="button" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
        View Cart
    </button>
    <button v-else @click="handleAddToCart" type="button" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors">
        Add to Cart
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { getCart, addToCart } from '../../utils/cart';
import type { Product } from '../../types';

// Define a simple type for the variation data needed by the button
interface VariationInfo {
    id: string;
    name: string;
}

// Helper to generate unique cart item ID (consistent with cart.ts)
const generateCartItemId = (productId: string, variationId?: string): string => {
  return variationId ? `${productId}_${variationId}` : productId;
};

const props = defineProps<{
    product: Product;
    initialVariationId?: string; 
    initialVariationName?: string; 
    variations: VariationInfo[]; // Add prop to receive all variations
}>();

const isInCart = ref(false);
// Internal state for the currently selected variation ID
const currentVariationId = ref<string | undefined>(props.initialVariationId);
// Internal state for the currently selected variation Name
const currentVariationName = ref<string | undefined>(props.initialVariationName); 

// Compute the unique ID based on the *internal* current variation ID
const currentCartItemId = computed(() => generateCartItemId(props.product.id, currentVariationId.value));
console.log(`Initial cart item ID: ${currentCartItemId.value}`);


const checkCartStatus = () => {
    const cart = getCart();
    // Use the computed property which relies on the internal currentVariationId
    isInCart.value = cart.items.some(item => item.id === currentCartItemId.value);
    console.log(`Checking cart status for ${currentCartItemId.value}: ${isInCart.value}`);
};

const handleAddToCart = () => {
    // Use internal state for variation details when adding to cart
    addToCart(props.product, 1, currentVariationId.value, currentVariationName.value);
    // Storage event will trigger checkCartStatus
};

const handleViewCartClick = () => {
    window.dispatchEvent(new Event('open-cart'));
};

// Use the specific 'storage' event dispatched by saveCart
const handleStorageChange = () => {
    console.log('Storage event detected in AddToCartButton');
    checkCartStatus(); // Re-check cart status based on currentVariationId
};

// Listen for the custom event dispatched by the variation selector
const handleVariationSelected = (event: CustomEvent) => {
    const newVariationId = event.detail;
    console.log('variation-selected event detected in AddToCartButton, new ID:', newVariationId);
    if (currentVariationId.value !== newVariationId) {
        currentVariationId.value = newVariationId;
        
        // Find the selected variation in the passed array and update the name
        const selectedVariation = props.variations.find(v => v.id === newVariationId);
        if (selectedVariation) {
            currentVariationName.value = selectedVariation.name;
            console.log('Updated currentVariationName to:', selectedVariation.name);
        } else {
            // Handle case where variation ID is not found (shouldn't happen ideally)
            currentVariationName.value = undefined; 
            console.warn(`Variation with ID ${newVariationId} not found in provided variations array.`);
        }
    }
    // Note: The watch below will trigger checkCartStatus based on ID change
};

onMounted(() => {
    checkCartStatus(); // Initial check
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('variation-selected', handleVariationSelected as EventListener); // Listen for variation changes
});

onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('variation-selected', handleVariationSelected as EventListener); // Clean up listener
});

// Watch for changes in the *internal* variationId to update cart status
watch(currentVariationId, (newId, oldId) => {
    if (newId !== oldId) {
        console.log('Internal Variation ID changed, checking cart status...');
        checkCartStatus();
        // If name wasn't updated in the event handler, update it here if necessary
        // currentVariationName.value = findVariationNameById(newId); 
    }
}, { immediate: false }); // Don't run immediately, onMounted handles initial check

</script>