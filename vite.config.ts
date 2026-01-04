import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    tailwindcss(),
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // Animation library (large)
          'vendor-motion': ['framer-motion'],
          // Markdown rendering
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          // AI SDK
          'vendor-ai': ['ai', '@ai-sdk/react'],
          // Icons
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
