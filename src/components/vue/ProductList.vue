<template>
  <div>
    <!-- Products header with count and sorting -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-gray-700">
        Showing <span class="font-semibold">{{ filteredProducts.length }}</span> products
      </div>
      <div class="flex items-center">
        <label for="sort-by" class="text-sm mr-2 text-gray-600">Sort by:</label>
        <select 
          id="sort-by" 
          v-model="sortBy"
          class="border border-gray-300 rounded-md text-sm p-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
    
    <!-- Product grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <product-card 
        v-for="product in sortedProducts" 
        :key="product.id" 
        :product="product"
        :category-name="getCategoryName(product.category)" 
      />
    </div>
    
    <!-- No results message -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <span class="material-symbols-outlined text-5xl text-gray-400 mb-4">search_off</span>
      <h3 class="text-xl font-bold text-gray-700">No products found</h3>
      <p class="text-gray-600 mt-2">Try adjusting your search or filters to find products.</p>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue';

export default {
  components: {
    ProductCard
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true,
      validator: (value) => value.every(cat => typeof cat === 'object' && cat.name && cat.id)
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selectedCategories: {
      type: Array, // Expecting an array of category IDs
      default: () => []
    },
    selectedProperties: {
      type: Array,
      default: () => []
    },
    maxPrice: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      sortBy: 'featured',
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        // Search by name
        const matchesSearch = this.searchQuery === '' || 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        // Filter by category
        const matchesCategory = this.selectedCategories.length === 0 || 
          this.selectedCategories.includes(product.category);
        
        // Filter by properties
        const matchesProperties = this.selectedProperties.length === 0 || 
          this.selectedProperties.every(prop => product.properties.includes(prop));
        
        // Filter by price
        const matchesPrice = product.price <= this.maxPrice;
        
        return matchesSearch && matchesCategory && matchesProperties && matchesPrice;
      });
    },
    sortedProducts() {
      return [...this.filteredProducts].sort((a, b) => {
        if (this.sortBy === 'price-low') {
          return a.price - b.price;
        } else if (this.sortBy === 'price-high') {
          return b.price - a.price;
        } else if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          // Featured sorting
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
    }
  },
  methods: {
    getCategoryName(categoryId) {      
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Uncategorized';
    }
  }
};
</script>
