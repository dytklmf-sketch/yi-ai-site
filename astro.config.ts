import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// A preview has no production canonical origin or sitemap.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
