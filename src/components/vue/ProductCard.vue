<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="h-48 overflow-hidden relative">
      <div v-if="product.featured" class="absolute top-0 right-0 bg-secondary-500 text-white px-3 py-1 z-10 rounded-bl-lg font-medium">
        Featured
      </div>
      <img
        :src="product.thumbnail.src"
        class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      <div class="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
        <p class="font-medium">{{ product.description }}</p>
      </div>
    </div>
    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold">{{ product.name }}</h3>
        <span class="text-secondary-600 font-bold">R{{ product.price.toFixed(2) }}</span>
      </div>
      <div class="mb-4">
        <span class="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{{ categoryName }}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="property in product.properties" 
          :key="property"
          class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
        >
          {{ property }}
        </span>
      </div>
      
      <Button :href="`/mics-website/products/${product.id}`" variant="primary" size="sm" classes="w-full justify-center">
        View Details
      </Button>
    </div>
  </div>
</template>

<script setup>

defineProps({
  product: {
    type: Object,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  }
});
import Button from '../Button.vue';
</script>
