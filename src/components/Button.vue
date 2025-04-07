<script setup lang="ts">
/**
 * Button component that supports both link and button functionality with multiple variants.
 */

import { computed } from 'vue';

interface Props {
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'text';

    /** URL for the button (renders as <a> if provided) */
    href?: string;

    /** Button size */
    size?: 'sm' | 'md' | 'lg';

    /** Open link in new tab */
    external?: boolean;

    /** Additional CSS classes */
    class?: string;

    /** Whether the button is full width */
    fullWidth?: boolean;

    /** Whether the button is disabled */
    disabled?: boolean;

    /** Icon to display before text */
    iconBefore?: string;

    /** Icon to display after text */
    iconAfter?: string;

    /** Optional aria-label */
    ariaLabel?: string;

    /** Button type (for form submissions) */
    type?: 'button' | 'submit' | 'reset';

    /** Form ID to associate with the button */
    form?: string;

    /** Name attribute for the button element */
    name?: string;

    /** Value attribute for the button element */
    value?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    external: false,
    class: '',
    fullWidth: false,
    disabled: false,
    type: 'button',
});

// Base styles shared by all variants
const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 transform hover:-translate-y-1";

// Size-specific styles
const sizeStyles = {
    sm: "px-6 py-2 text-sm",
    md: "px-8 py-3",
    lg: "px-10 py-4 text-lg"
};

// Variant-specific styles
const variantStyles = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 shadow-md hover:shadow-lg",
    outline: "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 shadow-sm hover:shadow",
    text: "bg-transparent text-primary-600 hover:text-primary-700 hover:bg-primary-50/30"
};

// Compute button styles
const buttonStyles = computed(() => [
    baseStyles,
    sizeStyles[props.size],
    variantStyles[props.variant],
    props.fullWidth ? "w-full" : "",
    props.disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
    props.class
].join(' '));

// External link attributes
const externalAttrs = computed(() => props.external ? { target: "_blank", rel: "noopener noreferrer" } : {});
</script>

<template>
    <a v-if="href && !disabled" :href="href" :class="buttonStyles" :aria-label="ariaLabel" v-bind="externalAttrs">
        <span v-if="iconBefore" class="material-symbols-outlined mr-2 text-[1em]">{{ iconBefore }}</span>
        <slot />
        <span v-if="iconAfter" class="material-symbols-outlined ml-2 text-[1em]">{{ iconAfter }}</span>
    </a>
    <button v-else :class="buttonStyles" :type="type" :disabled="disabled" :aria-label="ariaLabel" :form="form"
        :name="name" :value="value">
        <span v-if="iconBefore" class="material-symbols-outlined mr-2 text-[1em]">{{ iconBefore }}</span>
        <slot />
        <span v-if="iconAfter" class="material-symbols-outlined ml-2 text-[1em]">{{ iconAfter }}</span>
    </button>
</template>
