import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build-time CalVer (v{year}.{month}) — stamped from the build/deploy date,
// like VITE_COMMIT_SHA. Injected as __APP_VERSION__ via define.
const buildDate = new Date()
const APP_VERSION = `v${buildDate.getFullYear()}.${buildDate.getMonth() + 1}`

// https://vite.dev/config/
// Vite 8: Rolldown bundler + Oxc transforms (no Babel)
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('react-markdown') || id.includes('remark-gfm')) return 'vendor-markdown'
          if (id.includes('/ai/') || id.includes('@ai-sdk/react')) return 'vendor-ai'
          if (id.includes('lucide-react')) return 'vendor-icons'
        },
      },
    },
  },
})
