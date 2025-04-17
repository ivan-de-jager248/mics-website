<template>
  <div class="flex flex-col md:flex-row gap-8">
    <!-- Filter sidebar -->
    <div class="md:w-1/4">
      <product-filters 
        :categories="props.categories" 
        :properties="props.properties"
        v-model:selectedCategories="selectedCategories"
        v-model:selectedProperties="selectedProperties"
        v-model:maxPrice="maxPrice"
      />
    </div>
    
    <!-- Products grid -->
    <div class="md:w-3/4">
      <product-list 
        :products="props.products"
        :search-query="searchQuery"
        :selected-categories="selectedCategories"
        :selected-properties="selectedProperties"
        :max-price="maxPrice"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductFilters from './ProductFilters.vue';
import ProductList from './ProductList.vue';

// Define props
const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  properties: {
    type: Array,
    required: true
  }
  // initialSearchQuery prop is removed as we read from URL now
});

// Define reactive state
const searchQuery = ref('');
const selectedCategories = ref([]);
const selectedProperties = ref([]);
const maxPrice = ref(2000); // Default max price

// Read URL parameters on mount
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const queryParam = urlParams.get('q');
  if (queryParam) {
    searchQuery.value = queryParam;
  }

  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    // Assuming categories are comma-separated if multiple are allowed via URL
    selectedCategories.value = categoryParam.split(',').map(cat => cat.trim()).filter(cat => props.categories.includes(cat));
  }

  const propertyParam = urlParams.get('property');
  if (propertyParam) {
     // Assuming properties are comma-separated
    selectedProperties.value = propertyParam.split(',').map(prop => prop.trim()).filter(prop => props.properties.includes(prop));
  }

  const maxPriceParam = urlParams.get('maxPrice');
  if (maxPriceParam && !isNaN(parseInt(maxPriceParam))) {
    maxPrice.value = parseInt(maxPriceParam);
  }
});
</script>
