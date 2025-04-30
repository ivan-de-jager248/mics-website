<template>
    <div class="image-gallery space-y-4">
        <!-- Main Image Display -->
        <div class="main-image-container relative aspect-square overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-gray-100">
            <transition name="fade" mode="out-in">
                <img
                    :key="selectedImage.src"
                    :src="selectedImage.src"
                    :alt="selectedImage.alt"
                    class="w-full h-full object-contain"
                />
            </transition>
            <div v-if="selectedImage.description" class="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-60 text-white text-xs md:text-sm">
                {{ selectedImage.description }}
            </div>
            <!-- Placeholder if no images -->
            <div v-if="images.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-500">
                No Image Available
            </div>
        </div>

        <!-- Thumbnail Navigation -->
        <div v-if="images.length > 1" class="thumbnail-list flex space-x-2 overflow-x-auto p-2">
            <button
                v-for="(image, index) in images"
                :key="index"
                @click="selectImage(image)"
                :class="[
                    'thumbnail-item w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isSelected(image) ? 'border-primary-500 scale-105 shadow-md' : 'border-transparent hover:border-gray-400'
                ]"
                :aria-label="`View image ${index + 1}`"
                :aria-current="isSelected(image) ? 'true' : 'false'"
            >
                <img
                    :src="image.src"
                    :alt="`Thumbnail ${index + 1}${image.alt ? ': ' + image.alt : ''}`"
                    class="w-full h-full object-cover"
                    loading="lazy"
                />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => [], // Should contain objects with { src, alt, description? }
    },
});

const defaultImage = { src: '', alt: 'No image available', description: '' };
const selectedImage = ref(props.images[0] || defaultImage);

const selectImage = (image) => {
    if (selectedImage.value.src !== image.src) {
        selectedImage.value = image;
    }
};

const isSelected = (image) => {
    return selectedImage.value.src === image.src;
};

// Watch for prop changes if the component might be reused or data loads async
watch(() => props.images, (newImages) => {
    if (newImages && newImages.length > 0) {
        // Check if the current selected image is still in the new list
        const currentSelectionExists = newImages.some(img => img.src === selectedImage.value.src);
        if (!currentSelectionExists) {
            selectedImage.value = newImages[0];
        } else {
             // Ensure the ref is updated with potentially new metadata even if src is the same
             selectedImage.value = newImages.find(img => img.src === selectedImage.value.src) || newImages[0];
        }
    } else {
        selectedImage.value = defaultImage;
    }
}, { immediate: true });

</script>

<style scoped>
/* Simple fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar styling for thumbnail list */
.thumbnail-list::-webkit-scrollbar {
    height: 6px;
}
.thumbnail-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}
.thumbnail-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}
.thumbnail-list::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
/* For Firefox */
.thumbnail-list {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
}
</style>
