<template>
  <div class="relative max-w-2xl mx-auto">
    <input
      type="text"
      v-model="localSearchQuery"
      @input="onInput"
      placeholder="Search for products..."
      class="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none shadow-md"
    />
    <button @click="performSearch" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800">
      <span class="material-symbols-outlined">search</span>
    </button>
  </div>
</template>

<script>
import eventBus from '../../utils/eventBus'; // Import the event bus
import { debounce } from 'lodash-es'; // Using lodash for debounce

export default {
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // Initialize localSearchQuery directly with the prop value
      localSearchQuery: this.searchQuery, 
      debouncedUpdate: null // To hold the debounced function
    };
  },
  created() {
    // Initialize the debounced function
    this.debouncedUpdate = debounce(() => {
      this.emitUpdateEvent();
    }, 500); // Debounce by 500ms
  },
  methods: {
    onInput() {
      // Call the debounced function on input
      this.debouncedUpdate();
    },
    emitUpdateEvent() {
      // Emit event via bus
      eventBus.emit('search-updated', this.localSearchQuery);
    },
    performSearch() {
        // Cancel any pending debounced updates
        this.debouncedUpdate.cancel();
        // Immediately update URL and emit
        this.emitUpdateEvent();
    }
  }
};
</script>
