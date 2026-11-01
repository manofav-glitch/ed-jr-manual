import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Run `npx pwa-assets-generator` after changing public/icon.svg; the PNGs are committed.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#1747c4' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#1747c4' } },
  },
  images: ['public/icon.svg'],
});
