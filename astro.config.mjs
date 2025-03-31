import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://ivan-de-jager248.github.io',
  base: 'mics-website',
  integrations: [
    tailwind(),
    vue(),
  ],
});