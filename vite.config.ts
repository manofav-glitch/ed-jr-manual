import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site under /<repo-name>/, so the deploy workflow sets BASE_PATH.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  // The whole manual is bundled on purpose, so it works offline from the first load.
  build: { chunkSizeWarningLimit: 800 },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] },
});
