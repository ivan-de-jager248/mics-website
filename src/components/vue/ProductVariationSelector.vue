<template>
    <div>
        <label for="variation-select" class="block text-lg font-semibold mb-2 text-gray-700">
            Select Variation:
        </label>
        <select 
            id="variation-select" 
            v-model="selectedVariationId" 
            @change="emitVariationChange"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
            <option v-if="!initialVariationId" value="" disabled>Select a variation</option>
            <option v-for="variation in variations" :key="variation.id" :value="variation.id">
                {{ variation.name }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    variations: {
        type: Array,
        required: true,
    },
    initialVariationId: {
        type: String,
    },
});

const emit = defineEmits(['variation-changed']);

const selectedVariationId = ref(props.initialVariationId || (props.variations.length > 0 ? props.variations[0].id : ''));

function emitVariationChange() {
    console.log('Dispatching variation-selected event with ID:', selectedVariationId.value);
    // Dispatch a custom event on the window for the Astro script to catch
    const event = new CustomEvent('variation-selected', { detail: selectedVariationId.value });
    window.dispatchEvent(event);
    // Emit for potential parent Vue components (though not used here)
    // emit('variation-changed', selectedVariationId.value); 
}

// Watch for external changes to initialVariationId if needed, though typically set once.
// watch(() => props.initialVariationId, (newVal) => {
//     if (newVal && selectedVariationId.value !== newVal) {
//         selectedVariationId.value = newVal;
//     }
// });

// Ensure initial emit if an initial variation is set
// This might not be needed if the Astro script handles the initial state correctly
// import { onMounted } from 'vue';
// onMounted(() => {
//     if (selectedVariationId.value) {
//         emitVariationChange(); // Or let the Astro script handle initial setup
//     }
// });
</script>
