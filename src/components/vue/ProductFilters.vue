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
        <div v-for="category in categories" :key="category" class="flex items-center">
          <input 
            type="checkbox" 
            :id="`category-${formatId(category)}`"
            :value="category"
            v-model="localSelectedCategories"
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label :for="`category-${formatId(category)}`" class="ml-2 text-sm text-gray-700">
            {{ category }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- Properties filter -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-3 text-gray-800">Properties</h3>
      <div class="space-y-2">
        <div v-for="property in properties" :key="property" class="flex items-center">
          <input 
            type="checkbox" 
            :id="`property-${formatId(property)}`"
            :value="property"
            v-model="localSelectedProperties"
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label :for="`property-${formatId(property)}`" class="ml-2 text-sm text-gray-700">
            {{ property }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- Price range filter -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-3 text-gray-800">Price Range</h3>
      <div class="px-2">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">$0</span>
          <span class="text-sm text-gray-600">${{ localMaxPrice }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="2000" 
          step="100"
          v-model="localMaxPrice"
          class="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
        />
      </div>
    </div>
    
    <button @click="clearFilters" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors duration-200">
      Clear Filters
    </button>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
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
    },
    maxPrice: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      localSelectedCategories: this.selectedCategories,
      localSelectedProperties: this.selectedProperties,
      localMaxPrice: this.maxPrice
    };
  },
  watch: {
    localSelectedCategories(newVal) {
      this.$emit('update:selectedCategories', newVal);
    },
    localSelectedProperties(newVal) {
      this.$emit('update:selectedProperties', newVal);
    },
    localMaxPrice(newVal) {
      this.$emit('update:maxPrice', parseInt(newVal));
    }
  },
  methods: {
    formatId(str) {
      return str.replace(/\s+/g, '-').toLowerCase();
    },
    clearFilters() {
      this.localSelectedCategories = [];
      this.localSelectedProperties = [];
      this.localMaxPrice = 2000;
    }
  }
};
</script>
