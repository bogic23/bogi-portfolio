import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Split heavy vendors out of the app chunk so no single chunk
    // exceeds the 500 kB warning limit (and vendors cache separately).
    // NOTE: Rolldown only accepts manualChunks as a function.
    rolldownOptions: {
      output: {
        manualChunks(id) {
          // Firebase is ~560 kB as one chunk, so split it by service.
          if (id.includes('/firebase/auth') || id.includes('/@firebase/auth')) {
            return 'firebase-auth'
          }
          if (
            id.includes('/firebase/firestore') ||
            id.includes('/@firebase/firestore')
          ) {
            return 'firebase-firestore'
          }
          if (
            id.includes('node_modules/firebase/') ||
            id.includes('node_modules/@firebase/')
          ) {
            return 'firebase-core'
          }
          if (
            id.includes('node_modules/vue/') ||
            id.includes('node_modules/@vue/') ||
            id.includes('node_modules/vue-router/') ||
            id.includes('node_modules/pinia/')
          ) {
            return 'vue-vendor'
          }
        },
      },
    },
  },
})
