// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://astro.build/config
export default defineConfig({
  site: 'https://jiuchenga.github.io/beautifulJson',
  base: '/beautifulJson',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
  },
});
