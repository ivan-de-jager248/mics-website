<template>
  <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
    <h2 class="text-xl font-bold mb-6 pb-3 border-b border-gray-200 flex items-center">
      <span class="material-symbols-outlined mr-2 text-primary-600">filter_alt</span>
      Filters
    </h2>
    
    <!-- Categories filter -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-3 text-gray-800">Categories</h3>
      <div class="space-y-2">
        <div v-for="category in props.categories" :key="category.id" class="flex items-center">
          <input 
            type="checkbox" 
            :id="`category-${formatId(category.id)}`"
            :value="category.id"
            v-model="computedSelectedCategories"
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label :for="`category-${formatId(category.id)}`" class="ml-2 text-sm text-gray-700">
            {{ category.name }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- Properties filter -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-3 text-gray-800">Properties</h3>
      <div class="space-y-2">
        <div v-for="property in props.properties" :key="property" class="flex items-center">
          <input 
            type="checkbox" 
            :id="`property-${formatId(property)}`"
            :value="property"
            v-model="computedSelectedProperties"
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label :for="`property-${formatId(property)}`" class="ml-2 text-sm text-gray-700">
            {{ property }}
          </label>
        </div>
      </div>
    </div>
    
    <button @click="clearFilters" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors duration-200">
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Define props
const props = defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => value.every(cat => typeof cat === 'object' && cat.name && cat.id)
  },
  properties: {
    type: Array,
    required: true
  },
  selectedCategories: {
    type: Array,
    default: () => []
  },
  selectedProperties: {
    type: Array,
    default: () => []
  }
});

// Define emits for v-model updates
const emit = defineEmits([
  'update:selectedCategories', 
  'update:selectedProperties', 
  'update:maxPrice'
]);

// Computed property for selectedCategories v-model
const computedSelectedCategories = computed({
  get: () => props.selectedCategories,
  set: (value) => emit('update:selectedCategories', value)
});

// Computed property for selectedProperties v-model
const computedSelectedProperties = computed({
  get: () => props.selectedProperties,
  set: (value) => emit('update:selectedProperties', value)
});

// Helper function to format IDs
const formatId = (str) => {
  const cleanStr = str.replace(/\.[^/.]+$/, "");
  return cleanStr.replace(/\s+/g, '-').toLowerCase();
};

// Method to clear filters by emitting update events
const clearFilters = () => {
  emit('update:selectedCategories', []);
  emit('update:selectedProperties', []);
};
</script>
