import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200, // quiet warning without hiding real issues
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('@remix-run') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('three') || id.includes('@react-three') || id.includes('troika-three-text') || id.includes('three-stdlib')) {
              return 'vendor-three';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
