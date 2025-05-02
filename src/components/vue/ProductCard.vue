<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="h-48 overflow-hidden relative">
      <div v-if="product.featured" class="absolute top-0 right-0 bg-secondary-500 text-white px-3 py-1 z-10 rounded-bl-lg font-medium">
        Featured
      </div>
      <img
        :src="product.thumbnail.src"
        :alt="product.thumbnail.alt || `${product.name} thumbnail`"
        class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      <div class="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
      </div>
    </div>
    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold">{{ product.name }}</h3>
      </div>
      <div class="mb-4">
        <span class="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{{ categoryName }}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="item in displayedProperties"
          :key="`${item.variationId}-${item.property}`"
          class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
        >
          {{ item.property }}
        </span>
      </div>
      
      <Button :href="`/products/${product.id}`" variant="primary" size="sm" classes="w-full justify-center">
        View Details
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from '../Button.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  }
});

console.log('ProductCard props:', props);


const displayedProperties = computed(() => {
  const propertiesToShow = [];
  let count = 0;
  const maxProperties = 3;

  if (props.product.variations) {
    for (const variation of props.product.variations) {
      if (variation.properties) {
        for (const property of variation.properties) {
          if (count < maxProperties) {
            propertiesToShow.push({ variationId: variation.id, property: property });
            count++;
          } else {
            break; // Stop adding properties for this variation
          }
        }
      }
      if (count >= maxProperties) {
        break; // Stop iterating through variations
      }
    }
  }
  return propertiesToShow;
});

</script>
