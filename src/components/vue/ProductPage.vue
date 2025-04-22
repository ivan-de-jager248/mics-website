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
        :categories="props.categories"
        :search-query="searchQuery"
        :selected-categories="selectedCategories"
        :selected-properties="selectedProperties"
        :max-price="maxPrice"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ProductFilters from './ProductFilters.vue';
import ProductList from './ProductList.vue';
import eventBus from '../../utils/eventBus';

// Define props
const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    // Expect an array of objects with name and id
    type: Array,
    required: true,
    validator: (value) => value.every(cat => typeof cat === 'object' && cat.name && cat.id)
  },
  properties: {
    type: Array,
    required: true
  }
});

// Define reactive state
const searchQuery = ref('');
const selectedCategories = ref([]); // Will store category IDs
const selectedProperties = ref([]);
const maxPrice = ref(2000); // Default max price

// Handler for search updates from the event bus
const handleSearchUpdate = (query) => {
  searchQuery.value = query;
};

// Read URL parameters on mount and set up listener
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);

  // Listen for search updates from the event bus
  eventBus.on('search-updated', handleSearchUpdate);

  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    // Split potential comma-separated IDs and filter based on valid category IDs
    const categoryIdsFromUrl = categoryParam.split(',').map(id => id.trim());
    const validCategoryIds = props.categories.map(cat => cat.id);
    selectedCategories.value = categoryIdsFromUrl.filter(id => validCategoryIds.includes(id));
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

// Clean up the event listener when the component is unmounted
onUnmounted(() => {
  eventBus.off('search-updated', handleSearchUpdate);
});
</script>
