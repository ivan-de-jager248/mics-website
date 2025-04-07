<template>
  <div class="flex flex-col md:flex-row gap-8">
    <!-- Filter sidebar -->
    <div class="md:w-1/4">
      <product-filters 
        :categories="categories" 
        :properties="properties"
        v-model:selectedCategories="selectedCategories"
        v-model:selectedProperties="selectedProperties"
        v-model:maxPrice="maxPrice"
      />
    </div>
    
    <!-- Products grid -->
    <div class="md:w-3/4">
      <product-list 
        :products="products"
        :search-query="searchQuery"
        :selected-categories="selectedCategories"
        :selected-properties="selectedProperties"
        :max-price="maxPrice"
      />
    </div>
  </div>
</template>

<script>
import ProductFilters from './ProductFilters.vue';
import ProductList from './ProductList.vue';

export default {
  components: {
    ProductFilters,
    ProductList
  },
  props: {
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
    },
    initialSearchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchQuery: this.initialSearchQuery,
      selectedCategories: [],
      selectedProperties: [],
      maxPrice: 2000
    };
  }
};
</script>
