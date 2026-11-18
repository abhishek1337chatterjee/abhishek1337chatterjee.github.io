import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Build-time CalVer (v{year}.{month}) — stamped from the build/deploy date,
// like VITE_COMMIT_SHA. Injected as __APP_VERSION__ via define.
const buildDate = new Date();
const APP_VERSION = `v${buildDate.getFullYear()}.${buildDate.getMonth() + 1}`;

// https://vite.dev/config/
// Vite 8: Rolldown bundler + Oxc transforms (no Babel)
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rolldownOptions: {
      output: {
        // Groups pull their dependencies in recursively, so React must be claimed first
        // (highest priority); otherwise it lands in the chat-only markdown chunk.
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-markdown',
              test: /node_modules[\\/](react-markdown|remark-gfm)[\\/]/,
              priority: 10,
            },
            { name: 'vendor-icons', test: /node_modules[\\/]lucide-react[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
});
