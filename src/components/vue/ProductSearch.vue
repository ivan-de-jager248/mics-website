<template>
  <div class="relative max-w-2xl mx-auto">
    <input 
      type="text" 
      v-model="localSearchQuery"
      placeholder="Search for products..." 
      class="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none shadow-md"
    />
    <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800">
      <span class="material-symbols-outlined">search</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localSearchQuery: this.searchQuery
    };
  },
  watch: {
    localSearchQuery(newVal) {
      this.$emit('update:searchQuery', newVal);
    }
  }
};
</script>
